<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { RouteLocationMatched } from 'vue-router'
import { HOME_ICON } from '@/config'
import { useUserStore } from '@/stores/modules/user'
import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'

const route = useRoute()
const userStore = useUserStore()
const globalStore = useGlobalStore()
let breadCrumbList = ref<RouteLocationMatched[]>([])

const { breadcrumb, breadcrumbIcon } = storeToRefs(globalStore)

watch(
  () => route.fullPath,
  newValue => {
    fn(newValue)
  }
)

onMounted(() => {
  fn(route.path)
})

const fn = (path: string) => {
  if (path === '/home') {
    breadCrumbList.value = []
  } else {
    breadCrumbList.value = [route.matched[1]]
  }
}
</script>

<template>
  <el-breadcrumb v-if="breadcrumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-if="userStore.getRole === 'user'" to="/home">
      <template #default>
        <el-icon v-if="breadcrumbIcon"><component :is="HOME_ICON"></component></el-icon>
        <span>首页</span>
      </template>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadCrumbList" :key="item.path" :to="{ path: item.path }">
      <template #default>
        <el-icon v-if="breadcrumbIcon"><component :is="item.meta.icon"></component></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
:deep(.el-breadcrumb__inner) {
  display: flex;
  i {
    margin-right: 3px;
    font-size: 14.7px;
    color: var(--el-header-text-color);
  }
  span {
    color: var(--el-header-text-color);
  }
}
:deep(.el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner) {
  &:hover {
    i,
    span {
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
