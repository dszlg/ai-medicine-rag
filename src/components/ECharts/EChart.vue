<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { EChartsType, ECElementEvent } from 'echarts/core'
import { useGlobalStore } from '@/stores/modules/global'
import echarts, { ECOption } from './configs'

interface EChartProps {
  option: ECOption
  resize?: boolean
  width?: number
  height?: number
  theme?: Object | string
  renderer?: 'canvas' | 'svg'
  onClick?: (event: ECElementEvent) => any
}

const props = withDefaults(defineProps<EChartProps>(), {
  resize: true,
  renderer: 'canvas'
})

let chart: EChartsType | null = null
const globalStore = useGlobalStore()
const echartsRef = ref<HTMLElement | null>()

const echartsStyle = computed(() => {
  return {
    width: props.width ? `${props.width}px` : '100%',
    height: props.height ? `${props.height}px` : '100%'
  }
})

const footer = computed(() => {
  return globalStore.footer
})
const isCollapse = computed(() => {
  return globalStore.isCollapse
})
// 界面大小改变也该让echarts重新渲染
watch([footer, isCollapse], () => {
  chart?.resize()
})

watch(
  () => props.option,
  option => {
    chart?.setOption(option)
  },
  { deep: true }
)

onMounted(() => {
  if (echartsRef.value) {
    chart = echarts.init(echartsRef.value)
    chart.setOption(props.option)
    if (props.resize) {
      window.addEventListener('resize', () => {
        chart?.resize()
      })
    }
  }
})
</script>

<template>
  <div class="echarts" ref="echartsRef" :style="echartsStyle"></div>
</template>
