<script setup lang="ts" name="SwitchDark">
import { storeToRefs } from 'pinia'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/modules/global'
import { useTheme } from '@/hooks/useTheme'

const { isDark } = storeToRefs(useGlobalStore())
const { switchDark } = useTheme()
</script>

<template>
  <el-switch v-model="isDark" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" @change="switchDark" />
</template>

<style lang="scss" scoped></style>
