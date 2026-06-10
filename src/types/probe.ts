export type TestStatus = 'waiting' | 'running' | 'success' | 'fail' | 'skipped'

export type ProbeTestId =
  | 'connection'
  | 'identity'
  | 'protocol'
  | 'tool-calling'
  | 'streaming'
  | 'context'
  | 'token-usage'
  | 'security'
  | 'performance'
  | 'model-consistency'
  | 'policy-boundary'
  | 'gateway-transparency'
  | 'logprobs'
  | 'stop-fidelity'
  | 'json-format'
  | 'max-tokens-clamp'
  | 'tool-choice'
  | 'sampling-params'
  | 'response-id-uniqueness'
  | 'prompt-fidelity'
  | 'cache-replay'
  | 'watermark'
  | 'concurrency'

export type TestSeverity = 'info' | 'low' | 'medium' | 'high'

export interface ProbeConfig {
  apiUrl: string
  apiKey: string
  model: string
  appendChatCompletions: boolean
  useDevProxy: boolean
  useAiScoring: boolean
}

export interface TestResult {
  id: string
  name: string
  status: TestStatus
  category?: string
  severity?: TestSeverity
  score: number
  duration: number
  detail: string
  evidence?: string
}

export interface ProbeCallRecord {
  id: number
  kind: 'chat' | 'stream'
  testName?: string
  startedAt: number
  duration: number
  request: Record<string, unknown>
  response?: {
    id?: string
    object?: string
    model?: string
    finishReason?: string | null
    content?: string
    usage?: ChatCompletionUsage
  }
  error?: string
}

export interface ProbeUsageSummary {
  callCount: number
  reportedUsageCallCount: number
  missingUsageCallCount: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  records: ProbeCallRecord[]
}

export interface ProbeReport {
  totalScore: number
  startTime: number
  endTime: number
  tests: TestResult[]
  aiScoring?: {
    enabled: boolean
    error?: string
  }
  aiReport?: {
    totalScore: number
    tests: TestResult[]
  }
  usage?: ProbeUsageSummary
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
}

export interface ChatCompletionLogprobs {
  content?: Array<{
    token?: string
    logprob?: number
    top_logprobs?: Array<{ token?: string; logprob?: number }>
  }> | null
}

export interface ChatCompletionChoice {
  index?: number
  message?: {
    role?: string
    content?: string | null
    tool_calls?: unknown[]
  }
  delta?: {
    role?: string
    content?: string | null
    tool_calls?: unknown[]
  }
  logprobs?: ChatCompletionLogprobs | null
  finish_reason?: string | null
}

export interface ChatCompletionUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
  prompt_tokens_details?: {
    cached_tokens?: number
    audio_tokens?: number
  }
  completion_tokens_details?: {
    reasoning_tokens?: number
    audio_tokens?: number
  }
}

export interface ChatCompletionResponse {
  id?: string
  object?: string
  created?: number
  model?: string
  system_fingerprint?: string
  choices?: ChatCompletionChoice[]
  usage?: ChatCompletionUsage
}
