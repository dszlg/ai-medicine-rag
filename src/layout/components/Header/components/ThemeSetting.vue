<script setup>
import emitter from '@/utils/mittBus'
const openDrawer = () => {
  emitter.emit('open-drawer')
}
</script>

<template>
  <div class="theme-setting">
    <i :class="'iconfont icon-zhuti'" class="toolBar-icon" @click="openDrawer"></i>
  </div>
</template>

<style lang="scss" scoped></style>
