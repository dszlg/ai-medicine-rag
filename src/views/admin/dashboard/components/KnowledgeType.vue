<template>
  <e-chart :option="options" :height="280" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getKnowledgeType } from '@/api/stat'

onMounted(async () => {
  const { data } = await getKnowledgeType()
  knowledgeType.value = data
})

const knowledgeType = ref()
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
      data: knowledgeType.value,
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
