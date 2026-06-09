import axios, { AxiosError } from 'axios'

import type {
  ChatCompletionResponse,
  ChatMessage,
  ProbeCallRecord,
  ProbeConfig,
  ProbeUsageSummary,
} from '../types/probe'

interface ChatOptions {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
  tools?: unknown[]
  toolChoice?: unknown
  stop?: string[]
  responseFormat?: Record<string, unknown>
  logprobs?: boolean
  topLogprobs?: number
  topP?: number
  seed?: number
}

interface TimedChatResponse {
  data: ChatCompletionResponse
  duration: number
}

interface StreamMetrics {
  duration: number
  ttft: number
  tps: number
  content: string
}

function normalizeBaseUrl(apiUrl: string) {
  return apiUrl.trim().replace(/\/$/, '')
}

function getEndpoint(config: ProbeConfig) {
  const baseUrl = normalizeBaseUrl(config.apiUrl)
  const targetUrl = config.appendChatCompletions ? `${baseUrl}/chat/completions` : baseUrl

  if (config.useDevProxy) {
    return `/api/proxy/chat?target=${encodeURIComponent(targetUrl)}`
  }

  return targetUrl
}

function toErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string }; message?: string }>
    return (
      axiosError.response?.data?.error?.message ||
      axiosError.response?.data?.message ||
      axiosError.message
    )
  }

  return error instanceof Error ? error.message : 'Unknown request error'
}

function endpointHint() {
  return [
    'API returned a web page instead of OpenAI-compatible JSON.',
    'Use the API endpoint, for example https://domain/v1 with "Append /chat/completions" enabled,',
    'or https://domain/v1/chat/completions with append disabled.',
    'API 返回的是网页 HTML，不是 OpenAI 兼容 JSON。请填写 API 端点，例如 https://域名/v1 并开启拼接，或填写完整 /v1/chat/completions 并关闭拼接。',
  ].join(' ')
}

function isHtmlText(value: string) {
  const normalized = value.slice(0, 500).toLowerCase()

  return (
    normalized.includes('<!doctype html') ||
    normalized.includes('<html') ||
    normalized.includes('<head') ||
    normalized.includes('<body') ||
    normalized.includes('you need to enable javascript to run this app')
  )
}

function validateChatResponse(data: unknown): ChatCompletionResponse {
  if (typeof data === 'string') {
    throw new Error(isHtmlText(data) ? endpointHint() : 'API returned plain text instead of JSON.')
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('API returned an invalid response body instead of OpenAI-compatible JSON.')
  }

  const response = data as ChatCompletionResponse

  if (!Array.isArray(response.choices)) {
    throw new Error('API response is JSON, but it is not an OpenAI-compatible chat completion response.')
  }

  return response
}

async function assertStreamResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText && isHtmlText(errorText) ? endpointHint() : `Streaming failed with HTTP ${response.status}`)
  }

  if (contentType.includes('text/html')) {
    throw new Error(endpointHint())
  }
}

export function useOpenAI(config: ProbeConfig) {
  const endpoint = getEndpoint(config)
  const records: ProbeCallRecord[] = []
  let nextRecordId = 1
  let currentTestName = ''

  const client = axios.create({
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  })

  function getUsageSummary(): ProbeUsageSummary {
    const usageRecords = records.filter((record) => record.response?.usage)

    return {
      callCount: records.length,
      reportedUsageCallCount: usageRecords.length,
      missingUsageCallCount: records.length - usageRecords.length,
      promptTokens: usageRecords.reduce((sum, record) => sum + (record.response?.usage?.prompt_tokens ?? 0), 0),
      completionTokens: usageRecords.reduce(
        (sum, record) => sum + (record.response?.usage?.completion_tokens ?? 0),
        0,
      ),
      totalTokens: usageRecords.reduce((sum, record) => sum + (record.response?.usage?.total_tokens ?? 0), 0),
      records: records.map((record) => ({ ...record })),
    }
  }

  function createRecord(kind: ProbeCallRecord['kind'], request: Record<string, unknown>) {
    const record: ProbeCallRecord = {
      id: nextRecordId,
      kind,
      testName: currentTestName || undefined,
      startedAt: Date.now(),
      duration: 0,
      request,
    }

    nextRecordId += 1
    records.push(record)

    return record
  }

  function summarizeResponse(data: ChatCompletionResponse) {
    return {
      id: data.id,
      object: data.object,
      model: data.model,
      finishReason: data.choices?.[0]?.finish_reason,
      content: data.choices?.[0]?.message?.content?.slice(0, 300),
      usage: data.usage,
    }
  }

  async function chat(options: ChatOptions): Promise<TimedChatResponse> {
    const startedAt = performance.now()

    const body: Record<string, unknown> = {
      model: config.model,
      messages: options.messages,
      max_tokens: options.maxTokens ?? 128,
      temperature: options.temperature ?? 0,
    }

    if (options.tools) {
      body.tools = options.tools
    }
    if (options.toolChoice !== undefined) {
      body.tool_choice = options.toolChoice
    }
    if (options.stop) {
      body.stop = options.stop
    }
    if (options.responseFormat) {
      body.response_format = options.responseFormat
    }
    if (options.logprobs) {
      body.logprobs = true
      if (typeof options.topLogprobs === 'number') {
        body.top_logprobs = options.topLogprobs
      }
    }
    if (typeof options.topP === 'number') {
      body.top_p = options.topP
    }
    if (typeof options.seed === 'number') {
      body.seed = options.seed
    }

    const record = createRecord('chat', body)

    try {
      const response = await client.post<unknown>(endpoint, body)
      const data = validateChatResponse(response.data)
      const duration = Math.round(performance.now() - startedAt)

      record.duration = duration
      record.response = summarizeResponse(data)

      return {
        data,
        duration,
      }
    } catch (error) {
      const message = toErrorMessage(error)
      record.duration = Math.round(performance.now() - startedAt)
      record.error = message
      throw new Error(message)
    }
  }

  async function stream(messages: ChatMessage[]): Promise<StreamMetrics> {
    const startedAt = performance.now()
    const body = {
      model: config.model,
      messages,
      max_tokens: 128,
      temperature: 0,
      stream: true,
    }
    const record = createRecord('stream', body)
    let firstTokenAt = 0
    let tokenCount = 0
    let content = ''

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      await assertStreamResponse(response)

      const responseBody = response.body
      if (!responseBody) {
        throw new Error(`Streaming failed with HTTP ${response.status}`)
      }

      const reader = responseBody.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()

          if (!trimmed.startsWith('data:')) {
            continue
          }

          const payload = trimmed.replace(/^data:\s*/, '')

          if (payload === '[DONE]') {
            continue
          }

          const parsed = JSON.parse(payload) as ChatCompletionResponse
          const delta = parsed.choices?.[0]?.delta?.content ?? ''

          if (delta) {
            firstTokenAt ||= performance.now()
            tokenCount += 1
            content += delta
          }
        }
      }

      const duration = Math.round(performance.now() - startedAt)
      const ttft = firstTokenAt ? Math.round(firstTokenAt - startedAt) : duration
      const secondsAfterFirstToken = Math.max((duration - ttft) / 1000, 0.001)

      record.duration = duration
      record.response = {
        content: content.slice(0, 300),
      }

      return {
        duration,
        ttft,
        tps: Math.round(tokenCount / secondsAfterFirstToken),
        content,
      }
    } catch (error) {
      const message = toErrorMessage(error)
      record.duration = Math.round(performance.now() - startedAt)
      record.error = message
      throw new Error(message)
    }
  }

  return {
    chat,
    getUsageSummary,
    setCurrentTestName(testName: string) {
      currentTestName = testName
    },
    stream,
  }
}
