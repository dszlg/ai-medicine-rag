<script setup lang="ts">
import Footer from '../Footer/index.vue'
</script>

<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :max="12">
          <component :is="Component" :key="route.fullPath"></component>
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <Footer />
</template>

<style lang="scss" scoped>
.el-main {
  padding: $main-padding;
  background-color: var(--el-bg-color-page);
}
</style>
