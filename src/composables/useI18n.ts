import { computed, ref } from 'vue'

import type { TestSeverity, TestStatus } from '../types/probe'

type Locale = 'zh-CN' | 'en-US'
type MessageKey =
  | 'nav.report'
  | 'nav.history'
  | 'nav.gitee'
  | 'nav.language'
  | 'hero.subtitle'
  | 'home.stepConfig'
  | 'home.stepTests'
  | 'home.stepReport'
  | 'home.emptyReport'
  | 'probe.noticeTitle'
  | 'probe.noticeBody'
  | 'probe.noticeRecord'
  | 'config.apiUrl'
  | 'config.apiUrlPlaceholder'
  | 'config.appendChat'
  | 'config.devProxy'
  | 'config.urlHint'
  | 'config.apiKey'
  | 'config.model'
  | 'config.modelPlaceholder'
  | 'config.noModels'
  | 'config.start'
  | 'config.running'
  | 'status.waiting'
  | 'status.running'
  | 'status.success'
  | 'status.fail'
  | 'status.skipped'
  | 'severity.info'
  | 'severity.low'
  | 'severity.medium'
  | 'severity.high'
  | 'report.totalScore'
  | 'report.elapsed'
  | 'report.title'
  | 'report.empty'
  | 'report.cost'
  | 'report.calls'
  | 'report.reportedTokens'
  | 'report.promptTokens'
  | 'report.completionTokens'
  | 'report.missingUsage'
  | 'report.records'
  | 'report.request'
  | 'report.response'
  | 'report.noUsage'
  | 'history.title'
  | 'history.empty'
  | 'history.tests'
  | 'history.tokens'

function normalizeLocale(value: string | null): Locale {
  return value === 'en-US' || value === 'en' ? 'en-US' : 'zh-CN'
}

const locale = ref<Locale>(normalizeLocale(localStorage.getItem('probe-locale')))

const messages: Record<Locale, Record<MessageKey, string>> = {
  'en-US': {
    'nav.report': 'Report',
    'nav.history': 'History',
    'nav.gitee': 'Gitee',
    'nav.language': '中文',
    'hero.subtitle':
      'Test compatibility, performance, and authenticity across GPT, Claude, DeepSeek, Gemini, MiMo, and OpenAI-compatible APIs.',
    'home.stepConfig': 'Step 01 · Configure API',
    'home.stepTests': 'Step 02 · Test Items',
    'home.stepReport': 'Step 03 · Probe Report',
    'home.emptyReport': 'Run a probe to generate score, radar chart, and detailed results.',
    'probe.noticeTitle': 'Frontend-only probe',
    'probe.noticeBody':
      'The API key is used only in the browser request and is not stored by this app. Running the probe consumes some tokens from the configured API account.',
    'probe.noticeRecord':
      'Because the probe runs fully in the frontend, each request body and response summary can be recorded locally to review usage and estimate how many calls were made.',
    'config.apiUrl': 'API URL',
    'config.apiUrlPlaceholder': 'https://api.openai.com/v1 or full chat completions endpoint',
    'config.appendChat': 'Append /chat/completions',
    'config.devProxy': 'Use local dev proxy for CORS',
    'config.urlHint':
      'Official OpenAI base URLs usually need this enabled. Some transit gateways already provide a full endpoint and should leave it off. The local proxy only works while running Vite dev server.',
    'config.apiKey': 'API Key',
    'config.model': 'Model',
    'config.modelPlaceholder': 'Search or select a model...',
    'config.noModels': 'No matching models',
    'config.start': 'Start Probe',
    'config.running': 'Running Probe',
    'status.waiting': 'Waiting',
    'status.running': 'Running',
    'status.success': 'Success',
    'status.fail': 'Fail',
    'status.skipped': 'Skipped',
    'severity.info': 'Info',
    'severity.low': 'Low risk',
    'severity.medium': 'Medium risk',
    'severity.high': 'High risk',
    'report.totalScore': 'Total Score',
    'report.elapsed': 'Elapsed',
    'report.title': 'Report',
    'report.empty': 'No report yet. Start a probe from the home page.',
    'report.cost': 'Probe Cost',
    'report.calls': 'Calls',
    'report.reportedTokens': 'Reported Tokens',
    'report.promptTokens': 'Prompt Tokens',
    'report.completionTokens': 'Completion Tokens',
    'report.missingUsage': 'Calls Missing Usage',
    'report.records': 'Request / Response Records',
    'report.request': 'Request',
    'report.response': 'Response',
    'report.noUsage': 'No usage summary was reported by this API.',
    'history.title': 'History',
    'history.empty':
      'History is reserved for the first phase. Completed reports are stored locally after probes run.',
    'history.tests': 'tests',
    'history.tokens': 'tokens',
  },
  'zh-CN': {
    'nav.report': '报告',
    'nav.history': '历史',
    'nav.gitee': 'Gitee',
    'nav.language': 'English',
    'hero.subtitle': '检测 GPT、Claude、DeepSeek、Gemini、MiMo 以及 OpenAI 兼容 API 的兼容性、性能与真实性。',
    'home.stepConfig': '步骤 01 · 配置接口',
    'home.stepTests': '步骤 02 · 检测项目',
    'home.stepReport': '步骤 03 · 检测报告',
    'home.emptyReport': '运行检测后生成总评分、雷达图和详细结果。',
    'probe.noticeTitle': '纯前端检测',
    'probe.noticeBody':
      'API Key 只用于浏览器发起请求，本应用不会存储。运行检测会消耗所配置 API 账户的一些 token。',
    'probe.noticeRecord':
      '因为检测逻辑全部在前端执行，可以把每次检测的入参和返参摘要记录在本地，用来查看用量并预估实际调用次数。',
    'config.apiUrl': 'API 地址',
    'config.apiUrlPlaceholder': 'https://api.openai.com/v1 或完整 chat completions endpoint',
    'config.appendChat': '拼接 /chat/completions',
    'config.devProxy': '使用本地开发代理解决 CORS',
    'config.urlHint':
      '官方 OpenAI base URL 通常需要开启拼接。部分中转站已经提供完整 endpoint，应关闭拼接。本地代理仅在 Vite 开发服务器下有效。',
    'config.apiKey': 'API Key',
    'config.model': '模型',
    'config.modelPlaceholder': '搜索或选择模型...',
    'config.noModels': '没有匹配的模型',
    'config.start': '开始检测',
    'config.running': '检测中',
    'status.waiting': '等待',
    'status.running': '运行中',
    'status.success': '通过',
    'status.fail': '失败',
    'status.skipped': '已跳过',
    'severity.info': '信息',
    'severity.low': '低风险',
    'severity.medium': '中风险',
    'severity.high': '高风险',
    'report.totalScore': '总评分',
    'report.elapsed': '耗时',
    'report.title': '报告',
    'report.empty': '暂无报告，请先在首页开始检测。',
    'report.cost': '检测耗费',
    'report.calls': '调用次数',
    'report.reportedTokens': '已上报 Token',
    'report.promptTokens': '输入 Token',
    'report.completionTokens': '输出 Token',
    'report.missingUsage': '未返回用量的调用',
    'report.records': '入参 / 返参记录',
    'report.request': '入参',
    'report.response': '返参',
    'report.noUsage': '该 API 没有返回 usage 用量汇总。',
    'history.title': '历史',
    'history.empty': '历史记录为第一阶段占位；检测完成后报告会保存在本地。',
    'history.tests': '项检测',
    'history.tokens': 'tokens',
  },
}

const testNames: Record<Locale, Record<string, string>> = {
  'en-US': {},
  'zh-CN': {
    'Connection Test': '连接测试',
    'Identity Test': '身份识别',
    'Model Consistency': '模型一致性',
    'Protocol Test': '协议规范',
    'Tool Calling Test': '工具调用',
    'Tool Choice Fidelity': '工具选择一致性',
    'Logprobs Pass-through': 'Logprobs 透传',
    'Stop Sequence Fidelity': '停止序列一致性',
    'JSON Format Compliance': 'JSON 格式合规',
    'Max Tokens Clamp': 'Max Tokens 限制检测',
    'Sampling Parameter Honesty': '采样参数真实性',
    'Streaming Test': '流式响应',
    'Context Test': '上下文测试',
    'Token Usage Test': 'Token 用量',
    'Response ID Uniqueness': '响应 ID 唯一性',
    'Cache Replay Detection': '缓存重放检测',
    'Prompt Fidelity': 'Prompt 透传一致性',
    'Hidden Watermark Scan': '隐藏水印扫描',
    'Concurrency Serialization': '并发串行化检测',
    'Security Test': '安全检查',
    'Policy Boundary': '合规边界',
    'Gateway Transparency': '网关透明度',
    'Performance Test': '性能测试',
  },
}

const categories: Record<Locale, Record<string, string>> = {
  'en-US': {},
  'zh-CN': {
    Connectivity: '连通性',
    Authenticity: '真实性',
    'Transit Risk': '中转风险',
    Protocol: '协议',
    Capability: '能力',
    Billing: '计费',
    Safety: '安全',
    Compliance: '合规',
    Performance: '性能',
    Skipped: '已跳过',
    General: '通用',
  },
}

const zhDetails: Record<string, string> = {
  'Waiting to verify API connectivity.': '等待验证 API 连通性。',
  'Waiting to inspect model identity claims.': '等待检查模型身份声明。',
  'Waiting to compare requested model with response identity signals.': '等待对比请求模型与响应身份信号。',
  'Waiting to check OpenAI-compatible response fields.': '等待检查 OpenAI 兼容响应字段。',
  'Waiting to validate tool call format.': '等待验证工具调用格式。',
  'Waiting to verify forced tool_choice is honored.': '等待验证强制 tool_choice 是否被遵守。',
  'Waiting to verify logprobs are returned by the upstream.': '等待验证上游是否返回 logprobs。',
  'Waiting to verify user stop sequences take effect.': '等待验证用户 stop 序列是否生效。',
  'Waiting to verify response_format=json_object is honored.': '等待验证 response_format=json_object 是否被遵守。',
  'Waiting to detect silent max_tokens clamping by the gateway.': '等待检测网关是否静默限制 max_tokens。',
  'Waiting to detect ignored or pinned temperature/top_p.': '等待检测 temperature/top_p 是否被忽略或固定。',
  'Waiting to measure streaming behavior.': '等待测量流式响应表现。',
  'Waiting to test context handling up to 20k characters.': '等待测试最多 20k 字符的上下文处理能力。',
  'Waiting to inspect token usage accounting.': '等待检查 Token 用量统计。',
  'Waiting to check whether response ids are reused across requests.': '等待检查多次请求是否复用响应 ID。',
  'Waiting to detect stale cache replay via unique nonces.': '等待通过唯一 nonce 检测缓存重放。',
  'Waiting to verify the system prompt passes through intact.': '等待验证 system prompt 是否完整透传。',
  'Waiting to scan for zero-width or invisible tracking characters.': '等待扫描零宽或不可见跟踪字符。',
  'Waiting to detect single-session serialization bottlenecks.': '等待检测单会话串行化瓶颈。',
  'Waiting to run lightweight instruction exposure checks.': '等待运行轻量级指令泄露检查。',
  'Waiting to check whether unsafe requests are refused or redirected.': '等待检查不安全请求是否被拒绝或转向。',
  'Waiting to inspect response metadata and gateway transparency.': '等待检查响应元数据与网关透明度。',
  'Waiting to measure repeated request latency.': '等待测量连续请求延迟。',
  'Running...': '运行中...',
  'Checking endpoint reachability before running tests...': '正在检测 endpoint 连通性，随后再运行其他测试...',
  'Skipped because the configured API URL did not pass the connection preflight.':
    '已跳过，因为配置的 API URL 未通过连接预检。',
  'tool_calls exists and follows OpenAI message format.': '已返回 tool_calls，且符合 OpenAI message 格式。',
  'tool_calls missing.': '缺少 tool_calls。',
  '20k character context accepted.': '已接受 20k 字符上下文。',
  '20k context accepted but recall was weak.': '已接受 20k 上下文，但召回表现较弱。',
  'usage, prompt_tokens, completion_tokens, or total_tokens missing.':
    '缺少 usage、prompt_tokens、completion_tokens 或 total_tokens。',
  'Unsafe transit-abuse request was refused or redirected.': '不安全的中转滥用请求已被拒绝或转向。',
  'Unsafe transit-abuse request was not clearly refused. Review output.':
    '不安全的中转滥用请求未被明确拒绝，请人工复核输出。',
  'Response metadata is incomplete or differs from requested model.': '响应元数据不完整，或与请求模型不一致。',
  'Response metadata is present and transparent.': '响应元数据完整且透明。',
  'Forced tool_choice was honored; the specified function was called.':
    '强制 tool_choice 已被遵守，指定函数被调用。',
  'A tool was called, but not the forced function. Relay may rewrite tool_choice.':
    '调用了工具，但不是强制指定的函数；中转可能改写了 tool_choice。',
  'Forced tool_choice was ignored; no tool_calls returned.': '强制 tool_choice 被忽略，未返回 tool_calls。',
  'logprobs returned with numeric values from the upstream.': '上游返回了带数值的 logprobs。',
  'logprobs field present but values look incomplete.': '存在 logprobs 字段，但数值不完整。',
  'logprobs requested but not returned; may be stripped or unsupported.':
    '请求了 logprobs 但未返回，可能被剥离或不支持。',
  'Stop sequence took effect; text after the marker was truncated.': 'Stop 序列已生效，标记后的文本被截断。',
  'Stop sequence did not truncate output; may be dropped by the relay.':
    'Stop 序列未截断输出，可能被中转丢弃。',
  'response_format=json_object honored; output parsed as valid JSON.':
    'response_format=json_object 已生效，输出可解析为有效 JSON。',
  'response_format=json_object ignored; output was not valid JSON.':
    'response_format=json_object 被忽略，输出不是有效 JSON。',
  'No completion_tokens reported; cannot evaluate clamping.': '未上报 completion_tokens，无法评估是否被限制。',
  'Output far shorter than requested max_tokens without a length stop; possible silent clamp.':
    '输出远短于请求的 max_tokens，且没有 length 结束原因，可能存在静默限制。',
  'Output length is consistent with the requested max_tokens budget.': '输出长度与请求的 max_tokens 预算一致。',
  'High-temperature outputs were identical; temperature/top_p may be ignored or pinned.':
    '高温采样输出完全一致，temperature/top_p 可能被忽略或固定。',
  'High-temperature outputs varied as expected; sampling parameters appear active.':
    '高温采样输出按预期变化，采样参数看起来有效。',
  'No response ids returned; cannot evaluate uniqueness.': '未返回响应 ID，无法评估唯一性。',
  'Distinct requests reused the same response id; possible templated or forged output.':
    '不同请求复用了相同响应 ID，可能存在模板化或伪造输出。',
  'Each request returned a unique response id.': '每次请求都返回了唯一响应 ID。',
  'Unique nonce was echoed back; no stale cache replay detected.': '唯一 nonce 被正确返回，未检测到陈旧缓存重放。',
  'Unique nonce was not returned; response may be a stale or templated cache hit.':
    '唯一 nonce 未被返回，响应可能来自陈旧缓存或模板。',
  'System prompt instruction was honored; prompt passed through intact.':
    'System prompt 指令被遵守，prompt 看起来已完整透传。',
  'System prompt instruction was not reflected; system message may be stripped or flattened.':
    'System prompt 指令未体现，system message 可能被剥离或扁平化。',
  'No zero-width or invisible tracking characters detected.': '未检测到零宽或不可见跟踪字符。',
  'Concurrent requests ran nearly serially; possible single-session reverse proxy bottleneck.':
    '并发请求几乎串行执行，可能存在单会话反向代理瓶颈。',
  'Concurrent requests overlapped; no obvious serialization bottleneck.':
    '并发请求有重叠，未发现明显串行化瓶颈。',
  'Model discussed hidden/system instructions. Review manually.': '模型提到了隐藏/system 指令，请人工复核。',
  'No obvious hidden instruction disclosure in lightweight check.': '轻量检查未发现明显隐藏指令泄露。',
  'Possible model/provider mismatch. Review returned identity signals.':
    '可能存在模型/供应商不一致，请复核返回的身份信号。',
  'No obvious mismatch between requested model and response identity signals.':
    '请求模型与响应身份信号之间未发现明显不一致。',
}

function translateDetail(text: string) {
  if (locale.value === 'en-US') {
    return text
  }

  if (zhDetails[text]) {
    return zhDetails[text]
  }

  if (text.startsWith('HTTP 200. Response received in ')) {
    return text.replace('HTTP 200. Response received in ', 'HTTP 200。响应耗时 ')
  }
  if (text.startsWith('Claimed ') && text.includes('. Detected identity signals: ')) {
    return text
      .replace('Claimed ', '声明模型 ')
      .replace('. Detected identity signals: ', '。检测到的身份信号：')
  }
  if (text.includes('/4 required response fields are present.')) {
    return text.replace('/4 required response fields are present.', '/4 个必需响应字段存在。')
  }
  if (text.startsWith('Usage exists: prompt ')) {
    return text
      .replace('Usage exists: prompt ', '已返回 usage：输入 ')
      .replace(', completion ', '，输出 ')
      .replace(', total ', '，合计 ')
  }
  if (text.startsWith('TTFT ')) {
    return text.replace('TTFT ', '首 token 延迟 ').replace('Output speed ', '输出速度 ')
  }
  if (text.startsWith('Found ') && text.includes(' invisible character(s); possible hidden watermark.')) {
    return text
      .replace('Found ', '发现 ')
      .replace(' invisible character(s); possible hidden watermark.', ' 个不可见字符，可能存在隐藏水印。')
  }
  if (text.startsWith('Average ')) {
    return text
      .replace('Average ', '平均 ')
      .replace('. Min ', '。最小 ')
      .replace('. Max ', '。最大 ')
      .replace('. Success rate ', '。成功率 ')
  }

  return text
}

export function useI18n() {
  const currentLocale = computed(() => locale.value)

  function t(key: MessageKey) {
    return messages[locale.value][key]
  }

  function toggleLocale() {
    locale.value = locale.value === 'en-US' ? 'zh-CN' : 'en-US'
    localStorage.setItem('probe-locale', locale.value)
  }

  function testName(name: string) {
    return testNames[locale.value][name] ?? name
  }

  function category(name?: string) {
    if (!name) {
      return categories[locale.value].General ?? 'General'
    }

    return categories[locale.value][name] ?? name
  }

  function status(status: TestStatus) {
    return t(`status.${status}` as MessageKey)
  }

  function severity(severity: TestSeverity = 'info') {
    return t(`severity.${severity}` as MessageKey)
  }

  return {
    locale: currentLocale,
    t,
    toggleLocale,
    testName,
    category,
    status,
    severity,
    detail: translateDetail,
  }
}
