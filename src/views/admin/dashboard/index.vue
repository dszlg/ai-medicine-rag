<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AdminStatVO } from '@/typings/api/stat'
import { getAdminOverview } from '@/api/stat'
import ConsultTrend from './components/ConsultTrend.vue'
import KnowledgeType from './components/KnowledgeType.vue'
import UserGrowth from './components/UserGrowth.vue'
import Department from './components/Department.vue'

onMounted(async () => {
  overview.value = await (await getAdminOverview()).data
})

const overview = ref<AdminStatVO>()
</script>

<template>
  <div>
    <el-row :gutter="12" class="mb12">
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ overview?.user_count ?? '--' }}</div>
          <el-text size="large">用户总数</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ overview?.doctor_count ?? '--' }}</div>
          <el-text size="large">医生总数</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ overview?.consult_count ?? '--' }}</div>
          <el-text size="large">咨询总数</el-text>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="card">
          <div class="card-value">{{ overview?.appointment_count ?? '--' }}</div>
          <el-text size="large">预约总数</el-text>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :xs="24" :md="12" class="mb12">
        <div class="card">
          <el-text size="large">咨询趋势</el-text>
          <ConsultTrend />
        </div>
      </el-col>
      <el-col :xs="24" :md="12" class="mb12">
        <div class="card">
          <el-text size="large">预约科室分布</el-text>
          <Department />
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="card">
          <el-text size="large">用户增长</el-text>
          <UserGrowth />
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="card">
          <el-text size="large">知识库类型</el-text>
          <KnowledgeType />
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
