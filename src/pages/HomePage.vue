<template>
  <main class="page-shell home-page">
    <section class="hero">
      <p class="hero-summary">{{ t('hero.subtitle') }}</p>
    </section>

    <section class="section">
      <h2 class="section-title">{{ t('home.stepConfig') }}</h2>
      <ConfigPanel :config="store.config" :is-running="store.isRunning" @submit="startProbe" />
      <p v-if="store.error" class="error-message">{{ store.error }}</p>
      <div class="probe-notice">
        <strong>{{ t('probe.noticeTitle') }}</strong>
        <p>{{ t('probe.noticeBody') }}</p>
        <p>{{ t('probe.noticeRecord') }}</p>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">{{ t('home.stepTests') }}</h2>
      <TestGrid :tests="store.tests" />
    </section>

    <section class="section">
      <h2 class="section-title">{{ t('home.stepReport') }}</h2>
      <ReportPanel v-if="store.report" :report="store.report" />
      <div v-else class="empty-report">
        {{ t('home.emptyReport') }}
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import ConfigPanel from '../components/ConfigPanel.vue'
import ReportPanel from '../components/ReportPanel.vue'
import TestGrid from '../components/TestGrid.vue'
import { useI18n } from '../composables/useI18n'
import { useProbe } from '../composables/useProbe'
import { useProbeStore } from '../stores/probe'
import type { ProbeConfig } from '../types/probe'

const store = useProbeStore()
const { locale, t } = useI18n()
const router = useRouter()

async function startProbe(config: ProbeConfig) {
  store.setConfig(config)
  store.resetTests()
  store.setRunning(true)

  try {
    const probe = useProbe(store.config, (result) => store.updateTest(result), locale.value)
    const report = await probe.runProbe()
    store.setReport(report)
    await router.push('/report')
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Probe failed.')
  } finally {
    store.setRunning(false)
  }
}
</script>

<style scoped>
.home-page {
  padding-bottom: 56px;
}

.hero {
  padding: 52px 0 24px;
}

.hero-summary {
  max-width: 620px;
  margin: 0;
  color: var(--color-muted);
  font-size: 18px;
  line-height: 1.6;
}

.error-message {
  margin: 12px 0 0;
  color: var(--color-error);
  font-size: 14px;
}

.probe-notice {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.probe-notice strong {
  font-size: 14px;
}

.probe-notice p {
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.55;
}

.empty-report {
  padding: 22px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  color: var(--color-muted);
  background: var(--color-surface);
  font-size: 14px;
}

@media (max-width: 560px) {
  .hero {
    padding-top: 32px;
  }

  .hero-summary {
    font-size: 16px;
  }
}
</style>
