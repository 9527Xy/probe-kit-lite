import { defineStore } from 'pinia'

import type { ProbeConfig, ProbeReport, TestResult } from '../types/probe'

const HISTORY_KEY = 'probe-history'
const MAX_HISTORY = 10

export const defaultTests: TestResult[] = [
  {
    id: 'connection',
    name: 'Connection Test',
    status: 'waiting',
    category: 'Connectivity',
    severity: 'info',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify API connectivity.',
  },
  {
    id: 'identity',
    name: 'Identity Test',
    status: 'waiting',
    category: 'Authenticity',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to inspect model identity claims.',
  },
  {
    id: 'model-consistency',
    name: 'Model Consistency',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'high',
    score: 0,
    duration: 0,
    detail: 'Waiting to compare requested model with response identity signals.',
  },
  {
    id: 'protocol',
    name: 'Protocol Test',
    status: 'waiting',
    category: 'Protocol',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to check OpenAI-compatible response fields.',
  },
  {
    id: 'tool-calling',
    name: 'Tool Calling Test',
    status: 'waiting',
    category: 'Protocol',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to validate tool call format.',
  },
  {
    id: 'tool-choice',
    name: 'Tool Choice Fidelity',
    status: 'waiting',
    category: 'Protocol',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify forced tool_choice is honored.',
  },
  {
    id: 'logprobs',
    name: 'Logprobs Pass-through',
    status: 'waiting',
    category: 'Protocol',
    severity: 'low',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify logprobs are returned by the upstream.',
  },
  {
    id: 'stop-fidelity',
    name: 'Stop Sequence Fidelity',
    status: 'waiting',
    category: 'Protocol',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify user stop sequences take effect.',
  },
  {
    id: 'json-format',
    name: 'JSON Format Compliance',
    status: 'waiting',
    category: 'Protocol',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify response_format=json_object is honored.',
  },
  {
    id: 'max-tokens-clamp',
    name: 'Max Tokens Clamp',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to detect silent max_tokens clamping by the gateway.',
  },
  {
    id: 'sampling-params',
    name: 'Sampling Parameter Honesty',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to detect ignored or pinned temperature/top_p.',
  },
  {
    id: 'streaming',
    name: 'Streaming Test',
    status: 'waiting',
    category: 'Capability',
    severity: 'low',
    score: 0,
    duration: 0,
    detail: 'Waiting to measure streaming behavior.',
  },
  {
    id: 'context',
    name: 'Context Test',
    status: 'waiting',
    category: 'Capability',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to test context handling up to 20k characters.',
  },
  {
    id: 'token-usage',
    name: 'Token Usage Test',
    status: 'waiting',
    category: 'Billing',
    severity: 'high',
    score: 0,
    duration: 0,
    detail: 'Waiting to inspect token usage accounting.',
  },
  {
    id: 'response-id-uniqueness',
    name: 'Response ID Uniqueness',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to check whether response ids are reused across requests.',
  },
  {
    id: 'cache-replay',
    name: 'Cache Replay Detection',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to detect stale cache replay via unique nonces.',
  },
  {
    id: 'prompt-fidelity',
    name: 'Prompt Fidelity',
    status: 'waiting',
    category: 'Authenticity',
    severity: 'high',
    score: 0,
    duration: 0,
    detail: 'Waiting to verify the system prompt passes through intact.',
  },
  {
    id: 'watermark',
    name: 'Hidden Watermark Scan',
    status: 'waiting',
    category: 'Safety',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to scan for zero-width or invisible tracking characters.',
  },
  {
    id: 'concurrency',
    name: 'Concurrency Serialization',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'low',
    score: 0,
    duration: 0,
    detail: 'Waiting to detect single-session serialization bottlenecks.',
  },
  {
    id: 'security',
    name: 'Security Test',
    status: 'waiting',
    category: 'Safety',
    severity: 'high',
    score: 0,
    duration: 0,
    detail: 'Waiting to run lightweight instruction exposure checks.',
  },
  {
    id: 'policy-boundary',
    name: 'Policy Boundary',
    status: 'waiting',
    category: 'Compliance',
    severity: 'high',
    score: 0,
    duration: 0,
    detail: 'Waiting to check whether unsafe requests are refused or redirected.',
  },
  {
    id: 'gateway-transparency',
    name: 'Gateway Transparency',
    status: 'waiting',
    category: 'Transit Risk',
    severity: 'medium',
    score: 0,
    duration: 0,
    detail: 'Waiting to inspect response metadata and gateway transparency.',
  },
  {
    id: 'performance',
    name: 'Performance Test',
    status: 'waiting',
    category: 'Performance',
    severity: 'low',
    score: 0,
    duration: 0,
    detail: 'Waiting to measure repeated request latency.',
  },
]

interface ProbeState {
  config: ProbeConfig
  tests: TestResult[]
  report: ProbeReport | null
  history: ProbeReport[]
  isRunning: boolean
  error: string
}

function createTests() {
  return defaultTests.map((test) => ({ ...test }))
}

function loadHistory(): ProbeReport[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history: ProbeReport[]) {
  const compactHistory = history.slice(0, MAX_HISTORY).map((report) => ({
    ...report,
    usage: report.usage
      ? {
          ...report.usage,
          records: report.usage.records.slice(0, 5),
        }
      : undefined,
  }))

  localStorage.setItem(HISTORY_KEY, JSON.stringify(compactHistory))
}

export const useProbeStore = defineStore('probe', {
  state: (): ProbeState => ({
    config: {
      apiUrl: '',
      apiKey: '',
      model: '',
      appendChatCompletions: true,
      useDevProxy: false,
      useAiScoring: true,
    },
    tests: createTests(),
    report: null,
    history: loadHistory(),
    isRunning: false,
    error: '',
  }),
  getters: {
    hasReport: (state) => Boolean(state.report),
  },
  actions: {
    setConfig(config: ProbeConfig) {
      this.config = {
        apiUrl: config.apiUrl.trim().replace(/\/$/, ''),
        apiKey: config.apiKey.trim(),
        model: config.model.trim(),
        appendChatCompletions: config.appendChatCompletions,
        useDevProxy: config.useDevProxy,
        useAiScoring: config.useAiScoring,
      }
    },
    resetTests() {
      this.tests = createTests()
      this.error = ''
    },
    setRunning(isRunning: boolean) {
      this.isRunning = isRunning
    },
    setError(error: string) {
      this.error = error
    },
    updateTest(result: TestResult) {
      const index = this.tests.findIndex((test) => test.id === result.id)

      if (index >= 0) {
        this.tests[index] = result
        return
      }

      this.tests.push(result)
    },
    setReport(report: ProbeReport) {
      this.report = report
      this.history = [report, ...this.history].slice(0, MAX_HISTORY)
      try {
        saveHistory(this.history)
      } catch {
        saveHistory([report])
      }
    },
    selectReport(report: ProbeReport) {
      this.report = report
    },
    loadHistory() {
      this.history = loadHistory()
      if (!this.report && this.history.length) {
        this.report = this.history[0]
      }
    },
  },
})
