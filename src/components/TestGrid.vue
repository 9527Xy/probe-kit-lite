<template>
  <div class="test-grid">
    <TestCard v-for="test in tests" :key="test.id" :test="test" />
  </div>
</template>

<script setup lang="ts">
import TestCard from './TestCard.vue'
import type { TestResult } from '../types/probe'

defineProps<{
  tests: TestResult[]
}>()
</script>

<style scoped>
.test-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 1080px) {
  .test-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .test-grid {
    grid-template-columns: 1fr;
  }
}
</style>
