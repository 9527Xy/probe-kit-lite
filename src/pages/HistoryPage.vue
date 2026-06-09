<template>
  <main class="page-shell history-page">
    <section class="section">
      <h1>{{ t('history.title') }}</h1>
      <div v-if="store.history.length" class="history-list">
        <article v-for="report in store.history" :key="report.startTime" class="history-item">
          <div>
            <strong>{{ report.totalScore }}</strong>
            <span>{{ formatTime(report.startTime) }}</span>
          </div>
          <p>
            {{ report.tests.length }} {{ t('history.tests') }} · {{ report.endTime - report.startTime }} ms ·
            {{ report.usage?.totalTokens ?? 0 }} {{ t('history.tokens') }}
          </p>
        </article>
      </div>
      <div v-else class="empty-state">
        {{ t('history.empty') }}
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useI18n } from '../composables/useI18n'
import { useProbeStore } from '../stores/probe'

const store = useProbeStore()
const { t, locale } = useI18n()

onMounted(() => {
  store.loadHistory()
})

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp)
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

.history-item div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
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

.history-item p {
  margin: 8px 0 0;
}
</style>
