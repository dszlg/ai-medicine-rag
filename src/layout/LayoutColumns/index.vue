<!-- 分栏布局 -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import Main from '@/layout/components/Main/index.vue'
import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const splitActive = ref<string>('')
const menuList = authStore.authMenuList
const activeMenu = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
)

onMounted(() => {
  splitActive.value = activeMenu.value
})

const changeSubMenu = (menu: AppRouteRecordRaw) => {
  splitActive.value = menu.path
  router.push(menu.path)
}
</script>

<template>
  <el-container>
    <div class="aside-split">
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <el-menu>
            <template v-for="menu in menuList" :key="menu.path">
              <div
                v-if="!menu.meta.hidden"
                class="split-item"
                :class="{ 'split-active': splitActive === menu.path }"
                @click="changeSubMenu(menu)"
              >
                <el-icon><component :is="menu.meta.icon"></component></el-icon>
                <div class="title">{{ menu.meta.title }}</div>
              </div>
            </template>
          </el-menu>
        </div>
      </el-scrollbar>
    </div>
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
