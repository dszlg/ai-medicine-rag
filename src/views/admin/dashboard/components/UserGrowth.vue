<template>
  <e-chart :option="options" :height="280" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { getUserGrowth } from '@/api/stat'

// onMounted(async () => {
//   const { data } = await getUserGrowth()
//   userGrowth.value = data
// })

// const userGrowth = ref()
const options = computed(() => ({
  tooltip: {},
  grid: {
    left: '8%',
    right: '8%',
    top: '12%',
    bottom: '8%'
  },
  xAxis: {
    type: 'category',
    data: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [8, 5, 4, 12, 9, 6, 9],
      type: 'bar'
    }
  ]
}))
</script>

<style scoped></style>
