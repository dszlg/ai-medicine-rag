<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { LayoutType } from '@/stores/interface'
import { useGlobalStore } from '@/stores/modules/global'
import ThemeDrawer from './components/ThemeDrawer/index.vue'
import LayoutVertical from './LayoutVertical/index.vue'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns
}
const layoutType = computed(() => globalStore.layout)

const { watermark } = storeToRefs(globalStore)
const content = computed(() => {
  return watermark.value ? 'watermark' : ''
})
</script>

<template>
  <el-watermark :content="content" id="watermark">
    <component :is="LayoutComponents[layoutType]"></component>
    <ThemeDrawer />
  </el-watermark>
</template>

<style lang="scss" scoped></style>
