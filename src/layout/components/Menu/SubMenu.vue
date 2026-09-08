<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'

const props = defineProps<{ menu: AppRouteRecordRaw }>()

const authStore = useAuthStore()

const handleClickMenu = (path: string) => {
  // 查找当前路由信息，检查是否包含外部URL
  const route = authStore.authMenuList.find((route: AppRouteRecordRaw) => route.path === path)

  if (route && route.meta?.url) {
    // 如果是外部链接，直接打开新窗口
    window.open(route.meta.url as string, '_blank')
  } else {
    // 否则执行正常的路由跳转
    router.push(path)
  }
}
</script>

<template>
  <template v-if="!menu.meta.hidden">
    <el-sub-menu v-if="menu.children" :index="menu.path">
      <template #title>
        <span class="sle">{{ menu.meta.title }}</span>
      </template>
      <template v-for="value in menu.children" :key="value.path">
        <SubMenu :menu="value" />
      </template>
    </el-sub-menu>
    <el-menu-item v-else :index="menu.path" @click="handleClickMenu(menu.path)">
      <el-icon><component :is="menu.meta.icon"></component></el-icon>
      <template #title>
        <span class="sle">{{ menu.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<style lang="scss" scoped>
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      content: '';
      background-color: var(--el-color-primary);
    }
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>
