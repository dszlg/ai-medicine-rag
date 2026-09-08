<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import { getAdminConsultList, deleteConsult } from '@/api/consult'
import { UserConsultVO } from '@/typings/api/consult'

const data = ref<UserConsultVO[]>([])
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref()
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getAdminConsultList(
      keyword.value,
      page.value,
      pageSize.value,
      statusFilter.value
    )
    data.value = list
    total.value = totalCount
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
  page.value = 1
  statusFilter.value = undefined
  loadData()
}

const handleDelete = async (row: UserConsultVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除该咨询记录吗？患者：${row.user_name || '未知'}，主诉：${row.chief_complaint || ''}`,
      '提示',
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    )
    await deleteConsult(row.id)
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
          v-model.trim="keyword"
          placeholder="搜索主诉 / 患者 / 医生"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-select
          class="ml12"
          v-model="statusFilter"
          placeholder="状态筛选"
          clearable
          style="width: 140px"
        >
          <el-option label="待回复" :value="0" />
          <el-option label="已回复" :value="1" />
        </el-select>
        <el-button class="ml12" type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </header>

    <!-- 表格 -->
    <el-empty v-if="!loading && !data.length" description="暂无咨询数据" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="chief_complaint" label="主诉" min-width="200" show-overflow-tooltip />
      <el-table-column prop="user_name" label="患者" min-width="100" />
      <el-table-column prop="doctor_name" label="医生" min-width="100" />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
            {{ row.status === 1 ? '已回复' : '待回复' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
