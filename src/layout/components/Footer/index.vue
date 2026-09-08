<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()

const { footer } = storeToRefs(globalStore)
</script>

<template>
  <div v-if="footer" class="footer flx-center">
    <a target="_blank"> 2026 © AI 智能医疗问诊平台 </a>
  </div>
</template>

<style lang="scss" scoped>
@use './index';
</style>
