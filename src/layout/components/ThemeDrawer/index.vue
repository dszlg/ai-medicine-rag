<script setup lang="ts">
import { ref, computed } from 'vue'
import emitter from '@/utils/mittBus'
import { DEFAULT_PRIMARY } from '@/config'
import { LayoutType } from '@/stores/interface/index'
import SwitchDark from '@/components/SwitchDark/index.vue'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'

const { changePrimary } = useTheme()
const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)

// 预定义主题颜色
const colorList = [
  DEFAULT_PRIMARY,
  '#daa96e',
  '#0c819f',
  '#409eff',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6'
]

// 打开样式抽屉
const drawerVisible = ref(false)
emitter.on('open-drawer', () => {
  drawerVisible.value = !drawerVisible.value
})

// 切换布局
const changeLayoutType = (type: LayoutType) => {
  globalStore.setGlobalState('layout', type)
}
</script>

<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="290px">
    <!-- 样式布局 -->
    <el-divider class="divider">
      <el-icon><Notification /></el-icon>
      布局样式
    </el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div
          class="layout-item layout-vertical"
          :class="{ 'is-active': layout === 'vertical' }"
          @click="changeLayoutType('vertical')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout === 'vertical'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div
          class="layout-item layout-classic"
          :class="{ 'is-active': layout === 'classic' }"
          @click="changeLayoutType('classic')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout === 'classic'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div
          class="layout-item layout-transverse"
          :class="{ 'is-active': layout === 'transverse' }"
          @click="changeLayoutType('transverse')"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout === 'transverse'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div
          class="layout-item layout-columns"
          :class="{ 'is-active': layout === 'columns' }"
          @click="changeLayoutType('columns')"
        >
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout === 'columns'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
    </div>

    <!-- 全局主题 -->
    <el-divider class="divider" content-position="center">
      <el-icon><ColdDrink /></el-icon>
      全局主题
    </el-divider>
    <div class="theme-item">
      <span>主题颜色</span>
      <el-color-picker
        v-model="globalStore.primary"
        :predefine="colorList"
        @change="changePrimary"
      />
    </div>
    <div class="theme-item">
      <span>暗黑模式</span>
      <SwitchDark />
    </div>

    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Setting /></el-icon>
      界面设置
    </el-divider>
    <div class="theme-item">
      <span>菜单折叠</span>
      <el-switch v-model="globalStore.isCollapse" />
    </div>
    <div class="theme-item">
      <span>水印</span>
      <el-switch v-model="globalStore.watermark" />
    </div>
    <div class="theme-item">
      <span>面包屑</span>
      <el-switch v-model="globalStore.breadcrumb" />
    </div>
    <div class="theme-item">
      <span>面包屑图标</span>
      <el-switch v-model="globalStore.breadcrumbIcon" />
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <el-switch v-model="globalStore.footer" />
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@use './index';
</style>
