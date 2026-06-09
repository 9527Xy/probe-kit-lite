import { createRouter, createWebHistory } from 'vue-router'

import HistoryPage from '../pages/HistoryPage.vue'
import HomePage from '../pages/HomePage.vue'
import ReportPage from '../pages/ReportPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'ProbeKit Lite - OpenAI 兼容 API 探测工具',
        description:
          'ProbeKit Lite 是 OpenAI 兼容 API 探测工具，用于检测 GPT、Claude、DeepSeek、Gemini 等 API 的兼容性、性能、真实性、Token 用量和网关透明度。',
      },
    },
    {
      path: '/report',
      name: 'report',
      component: ReportPage,
      meta: {
        title: 'API 探测报告 - ProbeKit Lite',
        description:
          '查看 ProbeKit Lite 生成的 AI API 探测报告，包括总评分、测试项结果、Token 用量、延迟表现和 OpenAI 兼容协议检查详情。',
      },
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
      meta: {
        title: '历史检测记录 - ProbeKit Lite',
        description:
          '查看 ProbeKit Lite 本地保存的 OpenAI 兼容 API 历史检测记录，追踪模型接口稳定性、性能和用量变化。',
      },
    },
  ],
})

export default router
