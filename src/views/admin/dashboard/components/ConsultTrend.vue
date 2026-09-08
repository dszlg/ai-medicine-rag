<template>
  <e-chart :option="options" :height="270" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getConsultTrend } from '@/api/stat'

onMounted(async () => {
  const { data } = await getConsultTrend('2026-08-03', '2026-08-09')
  consultTrend.value = data
})

const consultTrend = ref([])
const options = computed(() => ({
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  grid: {
    left: '8%',
    right: '8%',
    top: '12%',
    bottom: '8%'
  },
  xAxis: {
    type: 'category',
    data: consultTrend.value.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'line',
      data: consultTrend.value.map(item => item.count),
      smooth: true,
      areaStyle: { color: 'rgba(102,126,234,0.15)' },
      lineStyle: { color: '#667eea', width: 3 },
      itemStyle: { color: '#667eea' }
    }
  ]
}))
</script>

<style scoped></style>
