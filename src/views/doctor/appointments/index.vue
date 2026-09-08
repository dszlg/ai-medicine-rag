<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { AppointmentVO } from '@/typings/api/appointment'
import { getDoctorAppointment, updateAppointmentStatus } from '@/api/appointment'
import { formatDate } from '@/utils/day'

const list = ref<AppointmentVO[]>([])
const loading = ref(false)

/** 预约状态映射 */
const statusMap = [
  { type: 'info', label: '待确认' },
  { type: 'success', label: '已确认' },
  { type: 'warning', label: '已完成' },
  { type: 'danger', label: '已取消' }
] as const

onMounted(async () => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getDoctorAppointment()
    list.value = data || []
  } finally {
    loading.value = false
  }
}

const updateStatus = async (row: AppointmentVO, status: number, actionText: string) => {
  try {
    console.log(row)
    await ElMessageBox.confirm(`确定要${actionText}该预约吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateAppointmentStatus(row.id, status)
    ElMessage.success(`${actionText}成功`)
    loadData()
  } catch {
    /* 用户取消或请求失败 */
  }
}
</script>

<template>
  <div class="card">
    <!-- 表格 -->
    <el-empty v-if="!loading && !list.length" description="暂无预约数据" />
    <el-table v-else :data="list" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="user_name" label="患者" min-width="100" />
      <el-table-column prop="visit_date" label="预约日期" min-width="120" />
      <el-table-column prop="time_slot" label="时段" min-width="80" />
      <el-table-column prop="remark" label="预约原因" min-width="180" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status].type" size="small">
            {{ statusMap[row.status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 0"
            link
            type="primary"
            @click="updateStatus(row, 1, '确认')"
          >
            确认
          </el-button>
          <el-button
            v-if="row.status === 1"
            link
            type="success"
            @click="updateStatus(row, 2, '完成')"
          >
            完成
          </el-button>
          <el-button
            v-if="row.status === 0 || row.status === 1"
            link
            type="danger"
            @click="updateStatus(row, 3, '取消')"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
