<template>
  <main class="page-shell history-page">
    <section class="section">
      <h1>{{ t('history.title') }}</h1>
      <div v-if="store.history.length" class="history-list">
        <button
          v-for="report in store.history"
          :key="report.startTime"
          class="history-item"
          type="button"
          @click="openReport(report)"
        >
          <div class="history-item__header">
            <div class="score-pair">
              <div>
                <span>{{ t('history.originalScore') }}</span>
                <strong>{{ report.totalScore }}</strong>
              </div>
              <div v-if="report.aiReport">
                <span>{{ t('history.aiScore') }}</span>
                <strong>{{ report.aiReport.totalScore }}</strong>
              </div>
            </div>
            <span>{{ formatTime(report.startTime) }}</span>
          </div>
          <p>
            {{ report.tests.length }} {{ t('history.tests') }} · {{ report.endTime - report.startTime }} ms ·
            {{ report.usage?.totalTokens ?? 0 }} {{ t('history.tokens') }}
          </p>
        </button>
      </div>
      <div v-else class="empty-state">
        {{ t('history.empty') }}
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useI18n } from '../composables/useI18n'
import { useProbeStore } from '../stores/probe'
import type { ProbeReport } from '../types/probe'

const store = useProbeStore()
const { t, locale } = useI18n()
const router = useRouter()

onMounted(() => {
  store.loadHistory()
})

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp)
}

async function openReport(report: ProbeReport) {
  store.selectReport(report)
  await router.push('/report')
}
</script>

<style scoped>
.history-page {
  padding-bottom: 56px;
}

h1 {
  margin: 0 0 20px;
  font-size: 36px;
  letter-spacing: 0;
}

.history-list {
  display: grid;
  gap: 12px;
}

.history-item,
.empty-state {
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.history-item {
  width: 100%;
  cursor: pointer;
  color: inherit;
  font: inherit;
  text-align: left;
}

.history-item:hover,
.history-item:focus-visible {
  border-color: var(--color-text);
}

.history-item:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

.history-item div {
  display: flex;
}

.history-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.score-pair {
  display: flex;
  gap: 18px;
}

.score-pair div {
  display: grid;
  gap: 4px;
}

.history-item strong {
  font-size: 28px;
}

.history-item span,
.history-item p,
.empty-state {
  color: var(--color-muted);
  font-size: 14px;
}

.score-pair span {
  font-size: 12px;
  font-weight: 650;
}

.history-item p {
  margin: 8px 0 0;
}

@media (max-width: 560px) {
  .history-item__header,
  .score-pair {
    flex-direction: column;
  }
}
</style>
