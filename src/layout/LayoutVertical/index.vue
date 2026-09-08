<!-- 纵向布局 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import Main from '@/layout/components/Main/index.vue'
import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const accordion = computed(() => globalStore.accordion)
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.authMenuList)
const activeMenu = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
)
</script>

<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
          <span v-show="!isCollapse" class="logo-text">AI 智能医疗平台</span>
        </div>
        <el-scrollbar>
          <el-menu
            :router="false"
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="accordion"
            :collapse-transition="false"
          >
            <template v-for="menu in menuList" :key="menu.name">
              <SubMenu :menu="menu" />
            </template>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@use './index';
</style>
