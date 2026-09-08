<script setup lang="ts">
import { ref } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

const isFullscreen = ref(screenfull.isFullscreen)

const handleFullScreen = () => {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: '当前浏览器不支持全屏',
      type: 'warning'
    })
  }
  screenfull.toggle()
  isFullscreen.value = !screenfull.isFullscreen
}
</script>

<template>
  <div class="fullscreen">
    <i :class="['iconfont', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" class="toolBar-icon" @click="handleFullScreen"></i>
  </div>
</template>

<style lang="scss" scoped></style>
