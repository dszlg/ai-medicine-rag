<template>
  <e-chart :option="options" :height="270" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDepartmentDistribution } from '@/api/stat'

onMounted(async () => {
  const { data } = await getDepartmentDistribution()
  dept.value = data
})

const dept = ref([])
const options = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: dept.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))
</script>

<style scoped></style>
