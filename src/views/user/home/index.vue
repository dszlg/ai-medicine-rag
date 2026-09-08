<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { getNoticeList } from '@/api/notice'
import { NoticeVO } from '@/typings/api/notice'
import { UserStatVO } from '@/typings/api/stat'
import { getUserOverview } from '@/api/stat'
import { formatDate } from '@/utils/day'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const notices = ref<NoticeVO[]>([])
const stats = ref<UserStatVO>()

onMounted(async () => {
  // 获取公告列表
  notices.value = (await getNoticeList()).data as NoticeVO[]
  stats.value = (await getUserOverview()).data
})

const viewNotice = (id: number) => {
  router.push(`/notices/${id}`)
}

/** 快捷入口 */
const shortcuts = [
  { path: '/chat', label: 'AI智能问诊', icon: '🤖', color: '#667eea' },
  { path: '/consult', label: '在线咨询', icon: '💬', color: '#f5576c' },
  { path: '/appointment', label: '预约挂号', icon: '📅', color: '#764ba2' },
  { path: '/articles', label: '健康资讯', icon: '🔬', color: '#11998e' }
]
</script>

<template>
  <div class="home card">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1>您好，{{ userStore.getInfo?.nickname || '用户' }} 👋</h1>
        <p>AI智能医疗问诊平台，为您提供专业、便捷的健康服务</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ stats?.consult_count ?? '--' }}</div>
          <el-text size="large">我的咨询</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ stats?.appointment_count ?? '--' }}</div>
          <el-text size="large">我的预约</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ stats?.record_count ?? '--' }}</div>
          <el-text size="large">健康档案</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ stats?.chat_count ?? '--' }}</div>
          <el-text size="large">AI 对话</el-text>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <h2 class="section-title">快捷服务</h2>
    <el-row :gutter="20">
      <el-col v-for="item in shortcuts" :key="item.path" :xs="12" :sm="6">
        <div class="shortcut-card card" @click="$router.push(item.path)">
          <span class="shortcut-icon" :style="{ background: item.color }">{{ item.icon }}</span>
          <span class="shortcut-label">{{ item.label }}</span>
        </div>
      </el-col>
    </el-row>

    <!-- 公告通知 -->
    <h2 class="section-title">最新公告</h2>
    <div class="card">
      <el-empty v-if="!notices.length" description="暂无公告" />
      <div
        v-for="item in notices.slice(0, 5)"
        :key="item.id"
        class="notice-item"
        @click="viewNotice(item.id)"
      >
        <el-tag size="small" type="warning">公告</el-tag>
        <el-text class="notice-title">{{ item.title }}</el-text>
        <el-text class="notice-time">{{ formatDate(item.create_time!) }}</el-text>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index';
</style>
