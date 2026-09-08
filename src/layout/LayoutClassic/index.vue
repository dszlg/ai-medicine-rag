<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import SubMenu from '../components/Menu/SubMenu.vue'
import Main from '../components/Main/index.vue'
import ToolBarLeft from '../components/Header/ToolBarLeft.vue'
import ToolBarRight from '../components/Header/ToolBarRight.vue'

const route = useRoute()
const authStore = useAuthStore()

const { isCollapse, accordion } = storeToRefs(useGlobalStore())
// 激活菜单默认加载菜单的index
const activeMenu = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
)
const menuList = authStore.authMenuList
</script>

<template>
  <el-container class="layout">
    <el-header>
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
          <span class="logo-text">AI 智能问诊平台</span>
        </div>
        <ToolBarLeft />
      </div>
      <div class="header-ri">
        <ToolBarRight />
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '200px' }">
          <el-scrollbar>
            <el-menu
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
      <el-container class="classic-main">
        <Main />
      </el-container>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@use './index';
</style>
