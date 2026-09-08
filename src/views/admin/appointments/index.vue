<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { statusType } from '@/typings/global'
import { DepartmentVO } from '@/typings/api/department'
import { AppointmentVO } from '@/typings/api/appointment'
import { deleteAppointment, getAdminAppointment, updateAppointmentStatus } from '@/api/appointment'
import { getDepartmentList } from '@/api/department'
import { formatDate } from '@/utils/day'

const data = ref<AppointmentVO[]>([])
const departments = ref<DepartmentVO[]>([])
const loading = ref(false)
const keyword = ref('')
const departmentFilter = ref<number>()
const visitDateFilter = ref<Date>()
const statusFilter = ref<statusType>()
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const id = ref(0)

/** 预约状态映射 */
const statusMap = [
  { type: 'info', label: '待确认' },
  { type: 'success', label: '已确认' },
  { type: 'warning', label: '已完成' },
  { type: 'danger', label: '已取消' }
] as const

onMounted(async () => {
  loadData()
  // 获取科室列表
  const res = await getDepartmentList()
  departments.value = res.data ?? []
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: _total } = await getAdminAppointment(
      page.value,
      pageSize.value,
      keyword.value,
      departmentFilter.value,
      visitDateFilter.value?.toString(),
      statusFilter.value
    )
    data.value = list
    total.value = _total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  loadData()
}

const handleReset = () => {
  keyword.value = ''
  departmentFilter.value = undefined
  visitDateFilter.value = undefined
  statusFilter.value = undefined
  page.value = 1
  loadData()
}

const handleDelete = async (row: AppointmentVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除该预约记录吗？患者：${row.user_name || '未知'}，预约日期：${row.visit_date || ''}`,
      '提示',
      { type: 'warning', cancelButtonText: '取消', confirmButtonText: '确定' }
    )
    await deleteAppointment(row.id)
    ElMessage.success('删除成功')
    if (data.value.length === 1 && page.value > 1) {
      page.value -= 1
    }
    loadData()
  } catch {
    /* */
  }
}
</script>

<template>
  <div class="card">
    <header class="flx-justify-between mb12">
      <div class="left">
        <el-input
          class="mr12"
          v-model.trim="keyword"
          placeholder="搜索患者 / 医生 / 备注"
          clearable
          style="width: 240px"
          @keyup.enter="handleSearch"
        />
        <el-select
          class="mr12"
          v-model="departmentFilter"
          placeholder="选择科室"
          clearable
          style="width: 160px"
        >
          <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
        <el-date-picker
          class="mr12"
          v-model="visitDateFilter"
          type="date"
          placeholder="预约日期"
          value-format="YYYY-MM-DD"
          clearable
          style="width: 160px"
        />
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 140px">
          <el-option label="待确认" :value="0" />
          <el-option label="已确认" :value="1" />
          <el-option label="已完成" :value="2" />
          <el-option label="已取消" :value="3" />
        </el-select>
        <el-button type="primary" class="ml12" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </header>

    <!-- 表格 -->
    <el-empty v-if="!loading && !data.length" description="暂无预约数据" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="user_name" label="患者" min-width="100" />
      <el-table-column prop="doctor_name" label="医生" min-width="100" />
      <el-table-column prop="department_name" label="科室" min-width="120" />
      <el-table-column prop="visit_date" label="预约日期" min-width="120" />
      <el-table-column prop="time_slot" label="时段" min-width="100" />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="statusMap[row.status].type">
            {{ statusMap[row.status].label ?? '待确认' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column prop="create_time" label="创建时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time || row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
