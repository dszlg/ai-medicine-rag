<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from './hooks/useTheme'

const { initTheme } = useTheme()

onMounted(async () => {
  // 初始化主题
  initTheme()
})
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>
