<script setup>
import CollapseIcon from './components/CollapseIcon.vue'
import Breadcrumb from './components/Breadcrumb.vue'
</script>

<template>
  <div class="tool-bar-left">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb id="breadcrumb" />
  </div>
</template>

<style lang="scss" scoped>
.tool-bar-left {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>
