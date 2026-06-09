# ProbeKit Lite

ProbeKit Lite 是一个基于 Vue 3、Vite 和 TypeScript 构建的 OpenAI 兼容 API 探测工具。它可以在浏览器中直接对 GPT、Claude、DeepSeek、Gemini、MiMo 以及各类 OpenAI-compatible API 进行能力检测，帮助开发者判断接口是否真实、稳定、透明且符合预期。

## 功能特性

- API 连通性检测
- 模型身份与返回元数据检查
- OpenAI Chat Completions 协议兼容性验证
- Tool Calling / tool_choice 支持检测
- Streaming 流式响应测试
- JSON 格式、stop sequence、logprobs、max_tokens 等参数行为检测
- Token usage 用量统计与调用记录
- 上下文处理、缓存重放、响应 ID 唯一性检测
- 安全边界、策略拒答与网关透明度检查
- 生成评分报告、雷达图和本地历史记录

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- ECharts
- Axios

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## SEO 配置

上线前请把 `.env.example` 复制为 `.env.production`，并将 `VITE_SITE_URL` 改成真实部署域名，例如 `https://example.com`。构建前会自动按该域名生成 `public/robots.txt` 和 `public/sitemap.xml`。同时替换 `public/baidu_verify_code.html`、`public/google-site-verification.html` 和 `index.html` 里的站长平台验证码，然后在百度搜索资源平台和 Google Search Console 提交 `sitemap.xml`。

## 类型检查

```bash
npm run type-check
```

## 使用说明

1. 启动项目后，在首页填写 API 地址、API Key 和模型名称。
2. 根据接口类型选择是否自动拼接 `/chat/completions`。
3. 如果接口存在浏览器 CORS 限制，可在本地开发环境中启用开发代理。
4. 点击开始检测后，应用会依次运行检测项并生成评分报告。

## 注意事项

本项目的检测逻辑运行在浏览器端。API Key 仅用于发起当前浏览器请求，应用本身不会主动上传或存储密钥。运行检测会消耗所配置 API 账号的少量 token。

