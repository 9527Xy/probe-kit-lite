<template>
  <article class="test-card">
    <div class="test-card__header">
      <div>
        <span class="test-card__category">{{ category(test.category) }}</span>
        <h3>{{ testName(test.name) }}</h3>
      </div>
      <StatusBadge :status="test.status" />
    </div>
    <div class="test-card__metric">
      <span class="test-card__score">{{ test.score }}</span>
      <span class="test-card__severity" :class="`test-card__severity--${test.severity ?? 'info'}`">
        {{ severityLabel }}
      </span>
    </div>
    <div class="score-bar" aria-hidden="true">
      <span :style="{ width: `${test.score}%` }"></span>
    </div>
    <p>{{ detail(test.detail) }}</p>
    <p v-if="test.evidence" class="test-card__evidence">{{ test.evidence }}</p>
    <footer>
      <span>{{ test.duration }} ms</span>
      <span>{{ test.id }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import StatusBadge from './StatusBadge.vue'
import { useI18n } from '../composables/useI18n'
import type { TestResult } from '../types/probe'

const props = defineProps<{
  test: TestResult
}>()

const { category, detail, severity, testName } = useI18n()

const severityLabel = computed(() => severity(props.test.severity ?? 'info'))
</script>

<style scoped>
.test-card {
  display: flex;
  flex-direction: column;
  min-height: 232px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.test-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  margin: 4px 0 0;
  font-size: 15px;
  line-height: 1.35;
}

.test-card__category {
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.test-card__metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.test-card__score {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.test-card__severity {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 700;
}

.test-card__severity--low {
  color: var(--color-success);
}

.test-card__severity--medium {
  color: var(--color-warning);
}

.test-card__severity--high {
  color: var(--color-error);
}

.score-bar {
  height: 6px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-border);
}

.score-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-text);
}

p {
  margin: 12px 0 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.5;
}

.test-card__evidence {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 11px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  color: var(--color-muted);
  font-size: 12px;
}
</style>
