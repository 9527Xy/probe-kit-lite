# ProbeKit Lite

ProbeKit Lite 是一个基于 Vue 3、Vite 和 TypeScript 的 OpenAI 兼容 API 探测工具。它在浏览器内直接发起请求，用于检查 GPT、Claude、DeepSeek、Gemini、MiMo 以及各类 OpenAI-compatible 接口的连通性、协议兼容性、真实性、透明度与性能表现。

## 当前能力

- 首页配置检测目标，支持 API 地址、API Key、模型名、是否拼接 `/chat/completions`、是否启用本地开发代理、是否启用 AI 复评分
- 内置模型选择器，按 OpenAI、Anthropic、DeepSeek、MiMo、Gemini、Qwen 等分组展示，同时允许手动输入模型名
- 检测完成后生成报告页，展示总分、雷达图、各测试项结果、请求/响应摘要、Token 用量与调用记录
- 支持历史页，自动把最近 10 份报告保存在浏览器本地
- 支持中英双语界面切换
- 构建前自动生成 `robots.txt` 和 `sitemap.xml`

## 检测项

当前版本会依次运行 23 项检测：

- Connection Test
- Identity Test
- Model Consistency
- Protocol Test
- Tool Calling Test
- Tool Choice Fidelity
- Logprobs Pass-through
- Stop Sequence Fidelity
- JSON Format Compliance
- Max Tokens Clamp
- Sampling Parameter Honesty
- Streaming Test
- Context Test
- Token Usage Test
- Response ID Uniqueness
- Cache Replay Detection
- Prompt Fidelity
- Hidden Watermark Scan
- Concurrency Serialization
- Security Test
- Policy Boundary
- Gateway Transparency
- Performance Test

其中覆盖的重点包括：

- OpenAI Chat Completions 响应结构与字段完整性
- `tools`、`tool_choice`、`logprobs`、`stop`、`response_format`、`max_tokens`、`temperature`、`top_p` 等参数行为
- 流式响应、上下文承载、Token usage 统计
- 模型身份信号、网关改写、缓存重放、响应 ID 唯一性
- 安全边界、拒答策略、隐藏水印、并发串行化与延迟表现

## AI 复评分

开启“使用 AI 进行评分”后，探测完成会把本次检测结果和本地记录的请求/响应摘要再次发送给当前配置的模型，让它生成一份独立的 AI 报告。这样会额外消耗一些 token；如果复评失败，界面会保留原始启发式评分。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- ECharts
- Axios

## 项目结构

```text
src/
  components/     UI 组件
  composables/    探测逻辑、OpenAI 请求封装、i18n、SEO
  pages/          Home / Report / History 三个页面
  router/         路由配置
  stores/         Pinia 状态与本地历史记录
  styles/         全局样式与变量
  types/          类型定义
public/
  robots.txt
  sitemap.xml
  baidu_verify_code.html
  google-site-verification.html
scripts/
  generate-seo.mjs
```

## 开发

```bash
npm install
npm run dev
```

默认使用 Vite 开发服务器。本地开发时可以勾选“使用本地开发代理解决 CORS”，代理入口为 `/api/proxy/chat`，只在 `npm run dev` 下可用。

## 构建与预览

```bash
npm run build
npm run serve
```

`npm run build` 之前会自动执行 `scripts/generate-seo.mjs`，按当前环境变量生成 SEO 文件。

## 其他脚本

```bash
npm run type-check
npm run generate:seo
```

## SEO 配置

1. 把 `.env.example` 复制为 `.env.production`。
2. 设置 `VITE_SITE_URL=https://你的域名`。
3. 执行构建或单独运行 `npm run generate:seo`。
4. 按实际站点信息替换 `public/baidu_verify_code.html`、`public/google-site-verification.html` 与 `index.html` 中的验证内容。
5. 上线后向搜索引擎平台提交 `sitemap.xml`。

未配置时会使用默认域名 `https://probekitlite.top` 生成相关文件。

## 使用说明

1. 在首页填写 API 地址、API Key 和模型。
2. 如果你填的是基础地址，例如 `https://api.openai.com/v1`，通常需要开启“拼接 `/chat/completions`”。
3. 如果你填的是完整接口地址，例如 `https://domain/v1/chat/completions`，通常应关闭该选项。
4. 如遇浏览器跨域限制，可在本地开发环境启用代理。
5. 点击开始检测后，应用会先做连通性预检，再顺序执行全部检测项，最后跳转到报告页。
6. 检测完成后的报告会自动写入浏览器本地历史记录。

## 注意事项

- 本项目是纯前端探测工具，请求直接从浏览器发出。
- API Key 不会被应用主动上传或持久化保存，但会存在当前页面运行内存中并用于请求。
- 开启 AI 复评分会额外发起一次请求，并把本次检测摘要再次发送给目标模型。
- 历史记录保存在浏览器 `localStorage`，不是服务端存储。
- 运行完整检测会消耗一定 token，具体取决于目标模型、网关行为和 AI 复评分是否开启。

