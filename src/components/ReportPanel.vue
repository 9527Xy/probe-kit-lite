<template>
  <section v-if="report" class="report-panel">
    <div class="report-panel__summary">
      <div>
        <p class="eyebrow">{{ activeReportTitle }}</p>
        <strong>{{ activeTotalScore }}</strong>
      </div>
      <div>
        <p class="eyebrow">{{ t('report.elapsed') }}</p>
        <span>{{ elapsed }} ms</span>
      </div>
    </div>

    <div v-if="report.usage" class="usage-panel">
      <div class="usage-panel__header">
        <p class="eyebrow">{{ t('report.cost') }}</p>
        <span v-if="!report.usage.reportedUsageCallCount">{{ t('report.noUsage') }}</span>
      </div>

      <div class="usage-grid">
        <div>
          <span>{{ t('report.calls') }}</span>
          <strong>{{ report.usage.callCount }}</strong>
        </div>
        <div>
          <span>{{ t('report.reportedTokens') }}</span>
          <strong>{{ report.usage.totalTokens }}</strong>
        </div>
        <div>
          <span>{{ t('report.promptTokens') }}</span>
          <strong>{{ report.usage.promptTokens }}</strong>
        </div>
        <div>
          <span>{{ t('report.completionTokens') }}</span>
          <strong>{{ report.usage.completionTokens }}</strong>
        </div>
        <div>
          <span>{{ t('report.missingUsage') }}</span>
          <strong>{{ report.usage.missingUsageCallCount }}</strong>
        </div>
      </div>
    </div>

    <div v-if="report.aiReport" class="report-tabs" role="tablist" aria-label="Report type">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'original'"
        :class="{ 'report-tab--active': activeTab === 'original' }"
        @click="activeTab = 'original'"
      >
        {{ t('report.originalReport') }}
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'ai'"
        :class="{ 'report-tab--active': activeTab === 'ai' }"
        @click="activeTab = 'ai'"
      >
        {{ t('report.aiReport') }}
      </button>
    </div>

    <section class="report-section">
      <RadarChart :tests="activeTests" />

      <div class="result-list">
        <article v-for="test in activeTests" :key="test.id" class="result-row">
          <div class="result-row__summary">
            <div>
              <h3>{{ testName(test.name) }}</h3>
              <p>{{ detail(test.detail) }}</p>
            </div>
            <div class="result-row__meta">
              <StatusBadge :status="test.status" />
              <strong>{{ test.score }}</strong>
            </div>
          </div>

          <details v-if="recordsForTest(test).length" class="test-records">
            <summary>{{ t('report.records') }}</summary>
            <article v-for="record in recordsForTest(test)" :key="record.id" class="usage-record">
              <div class="usage-record__meta">
                <span>#{{ record.id }} · {{ recordTitle(record) }} · {{ record.duration }} ms</span>
                <span v-if="record.response?.usage">{{ record.response.usage.total_tokens ?? 0 }} tokens</span>
              </div>
              <div class="usage-record__payloads">
                <div>
                  <span>{{ t('report.request') }}</span>
                  <pre>{{ formatJson(record.request) }}</pre>
                </div>
                <div>
                  <span>{{ t('report.response') }}</span>
                  <pre>{{ formatJson(record.response ?? { error: record.error }) }}</pre>
                </div>
              </div>
            </article>
          </details>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import RadarChart from './RadarChart.vue'
import StatusBadge from './StatusBadge.vue'
import { useI18n } from '../composables/useI18n'
import type { ProbeCallRecord, ProbeReport, TestResult } from '../types/probe'

const props = defineProps<{
  report: ProbeReport | null
}>()

const { detail, t, testName } = useI18n()
const activeTab = ref<'original' | 'ai'>('original')

const elapsed = computed(() => {
  if (!props.report) {
    return 0
  }

  return props.report.endTime - props.report.startTime
})

const activeTests = computed(() => {
  if (activeTab.value === 'ai' && props.report?.aiReport) {
    return props.report.aiReport.tests
  }

  return props.report?.tests ?? []
})

const activeTotalScore = computed(() => {
  if (activeTab.value === 'ai' && props.report?.aiReport) {
    return props.report.aiReport.totalScore
  }

  return props.report?.totalScore ?? 0
})

const activeReportTitle = computed(() =>
  activeTab.value === 'ai' && props.report?.aiReport ? t('report.aiReport') : t('report.originalReport'),
)

const recordsByTestName = computed(() => {
  const map = new Map<string, ProbeCallRecord[]>()

  for (const record of props.report?.usage?.records ?? []) {
    if (!record.testName) {
      continue
    }

    const records = map.get(record.testName) ?? []
    records.push(record)
    map.set(record.testName, records)
  }

  return map
})

watch(
  () => props.report,
  () => {
    activeTab.value = 'original'
  },
)

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function recordTitle(record: ProbeCallRecord) {
  return record.testName ? testName(record.testName) : record.kind
}

function recordsForTest(test: TestResult) {
  return recordsByTestName.value.get(test.name) ?? []
}
</script>

<style scoped>
.report-panel {
  display: grid;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.report-panel__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 650;
  text-transform: uppercase;
}

strong {
  font-size: 36px;
  line-height: 1;
}

.report-panel__summary span {
  color: var(--color-muted);
  font-size: 14px;
}

.usage-panel {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
}

.usage-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.usage-panel__header span {
  color: var(--color-muted);
  font-size: 12px;
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.usage-grid div {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
}

.usage-grid span,
.usage-record span {
  color: var(--color-muted);
  font-size: 12px;
}

.usage-grid strong {
  overflow-wrap: anywhere;
  font-size: 22px;
}

.report-tabs {
  display: inline-flex;
  width: fit-content;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
}

.report-tabs button {
  min-height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  color: var(--color-muted);
  background: transparent;
  font-weight: 650;
}

.report-tabs button:hover,
.report-tab--active {
  color: var(--color-text) !important;
  background: var(--color-surface) !important;
}

.report-section {
  display: grid;
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.result-list {
  display: grid;
  gap: 10px;
}

.result-row {
  display: grid;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid var(--color-border);
}

.result-row__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.result-row h3 {
  margin: 0;
  font-size: 14px;
}

.result-row p {
  margin: 6px 0 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.5;
}

.result-row__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-row__meta strong {
  min-width: 36px;
  font-size: 20px;
  text-align: right;
}

.test-records {
  color: var(--color-text);
  font-size: 13px;
}

.test-records summary {
  cursor: pointer;
  color: var(--color-muted);
  font-weight: 650;
}

.usage-record {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
}

.usage-record__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.usage-record__payloads {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.usage-record__payloads div {
  min-width: 0;
}

pre {
  max-height: 220px;
  margin: 6px 0 0;
  overflow: auto;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-muted);
  background: var(--color-surface);
  font-size: 11px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .report-panel__summary,
  .result-row__summary {
    flex-direction: column;
  }

  .usage-grid,
  .usage-record__payloads {
    grid-template-columns: 1fr;
  }

  .result-row__meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
