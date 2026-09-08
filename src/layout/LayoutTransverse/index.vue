<!-- 横向布局 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MenuOptions } from '@/typings/global'
import { useAuthStore } from '@/stores/modules/auth'
import Main from '@/layout/components/Main/index.vue'
import SubMenu from '../components/Menu/SubMenu.vue'
import ToolBarRight from '../components/Header/ToolBarRight.vue'

const route = useRoute()
const authStore = useAuthStore()
const menuList = authStore.authMenuList
const activeMenu = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
)
const handleClickMenu = (subItem: MenuOptions) => {}
</script>

<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
        <span class="logo-text">AI 智能医疗平台</span>
      </div>
      <el-menu mode="horizontal" :router="false" :default-active="activeMenu">
        <template v-for="item in menuList" :key="item.path">
          <sub-menu :menu="item" />
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<style lang="scss" scoped>
@use './index';
</style>
