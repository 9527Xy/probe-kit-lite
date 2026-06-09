<template>
  <div ref="chartEl" class="radar-chart" aria-label="Probe score radar chart"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts } from 'echarts/core'

import type { TestResult } from '../types/probe'

echarts.use([RadarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  tests: TestResult[]
}>()

const chartEl = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

function renderChart() {
  if (!chartEl.value) {
    return
  }

  if (!chart) {
    chart = echarts.init(chartEl.value)
  }

  chart.setOption({
    tooltip: {},
    radar: {
      indicator: props.tests.map((test) => ({
        name: test.name.replace(' Test', ''),
        max: 100,
      })),
      radius: '68%',
      splitNumber: 4,
      axisName: {
        color: '#777777',
        fontSize: 11,
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.tests.map((test) => test.score),
            name: 'Score',
            areaStyle: {
              color: 'rgba(17, 17, 17, 0.08)',
            },
            lineStyle: {
              color: '#111111',
            },
            itemStyle: {
              color: '#111111',
            },
          },
        ],
      },
    ],
  })
}

function resizeChart() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
  chart = null
})

watch(() => props.tests, renderChart, { deep: true })
</script>

<style scoped>
.radar-chart {
  width: 100%;
  min-height: 320px;
}
</style>
