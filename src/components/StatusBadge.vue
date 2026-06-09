<template>
  <span class="status-badge" :class="statusClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from '../composables/useI18n'
import type { TestStatus } from '../types/probe'

const props = defineProps<{
  status: TestStatus
}>()

const { status } = useI18n()

const label = computed(() => status(props.status))
const statusClass = computed(() => `status-badge--${props.status}`)
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  min-height: 26px;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  background: var(--color-surface);
}

.status-badge--running {
  border-color: rgba(37, 99, 235, 0.3);
  color: var(--color-running);
}

.status-badge--success {
  border-color: rgba(22, 163, 74, 0.3);
  color: var(--color-success);
}

.status-badge--fail {
  border-color: rgba(220, 38, 38, 0.3);
  color: var(--color-error);
}

.status-badge--skipped {
  border-color: var(--color-border);
  color: var(--color-muted);
}
</style>
