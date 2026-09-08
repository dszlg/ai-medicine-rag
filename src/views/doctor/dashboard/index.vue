<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDoctorOverview } from '@/api/stat'
import { DoctorStatVO } from '@/typings/api/stat'

const data = ref<DoctorStatVO>()

onMounted(() => {
  getDoctorOverview().then(res => {
    data.value = res.data
  })
})
</script>

<template>
  <div class="card">
    <!-- <div class="welcome-banner">
      <div class="banner-content">
        <h1>您好，{{ '用户' }} 👋</h1>
        <p>AI智能医疗问诊平台，为您提供专业、便捷的健康服务</p>
      </div>
    </div> -->
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ data?.pending_consults ?? '--' }}</div>
          <el-text size="large">待回复咨询</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ data?.today_appointments ?? '--' }}</div>
          <el-text size="large">今日预约</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ data?.total_patients ?? '--' }}</div>
          <el-text size="large">患者总数</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ data?.replied_consults ?? '--' }}</div>
          <el-text size="large">已回复咨询</el-text>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.card-value {
  font-size: 32px;
  font-weight: 700;
  color: $primary-color;
}
</style>
