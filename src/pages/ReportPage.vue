<template>
  <main class="page-shell report-page">
    <section class="section">
      <h1>{{ t('report.title') }}</h1>
      <ReportPanel :report="store.report" />
      <div v-if="!store.report" class="empty-state">
        {{ t('report.empty') }}
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ReportPanel from '../components/ReportPanel.vue'
import { useI18n } from '../composables/useI18n'
import { useProbeStore } from '../stores/probe'

const store = useProbeStore()
const { t } = useI18n()

onMounted(() => {
  store.loadHistory()
})
</script>

<style scoped>
.report-page {
  padding-bottom: 56px;
}

h1 {
  margin: 0 0 20px;
  font-size: 36px;
  letter-spacing: 0;
}

.empty-state {
  padding: 22px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  color: var(--color-muted);
  background: var(--color-surface);
}
</style>
