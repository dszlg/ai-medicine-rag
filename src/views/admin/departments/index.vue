<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import { DepartmentVO, DepartmentCreateDTO } from '@/typings/api/department'
import {
  getDepartmentManageList,
  updateDepartment,
  deleteDepartment,
  createDepartment
} from '@/api/department'

const data = ref<DepartmentVO[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const id = ref(0)

const form = reactive<DepartmentCreateDTO>({
  name: '',
  sort_order: 0,
  description: ''
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: _total } = await getDepartmentManageList(
      keyword.value,
      page.value,
      pageSize.value
    )
    data.value = list
    total.value = _total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (keyword.value === '') return
  page.value = 1
  loadData()
}

const handleReset = () => {
  if (keyword.value !== '') keyword.value = ''
  page.value = 1
  loadData()
}

const openEdit = (row: DepartmentVO) => {
  dialogVisible.value = true
  isEdit.value = true
  id.value = row.id
  form.name = row.name
  form.description = row.description
  form.sort_order = row.sort_order
}

const handleDelete = async (row: DepartmentVO) => {
  try {
    await ElMessageBox.confirm(`确定删除科室「${row.name}」吗？`, '提示', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    })
    await deleteDepartment(row.id)
    ElMessage.success('删除成功')
    if (data.value.length === 1 && page.value > 1) {
      page.value -= 1
    }
    loadData()
  } catch {
    /* */
  }
}

const openDialog = () => {
  form.name = ''
  form.description = ''
  form.sort_order = 0
  isEdit.value = false
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.name) {
    ElMessage.warning('请输入科室名称')
    return
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await updateDepartment(id.value, { ...form })
      ElMessage.success('更新成功')
    } else {
      await createDepartment({ ...form })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch {
    /* */
  } finally {
    submitting.value = false
  }
}

const changePage = (val: number) => {
  page.value = val
  console.log(111)
  loadData()
}

const changePageSize = (val: number) => {
  pageSize.value = val
  console.log('changePageSize', val)
  loadData()
}
</script>

<template>
  <div class="departments card">
    <!-- 搜索表单 -->
    <div class="flx-justify-between mb12">
      <div class="left">
        <el-input
          v-model="keyword"
          placeholder="搜索科室名称 / 描述"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" class="ml12" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="openDialog">新增科室</el-button>
    </div>

    <!-- 表格 -->
    <el-empty v-if="!loading && !data.length" description="暂无科室数据" />
    <template v-else>
      <el-table :data="data" v-loading="loading" class="adaptive-table" stripe>
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="name" label="科室名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="doctor_count" label="医生数量" min-width="100" />
        <el-table-column prop="sort_order" label="排序" min-width="80" />
        <el-table-column prop="create_time" label="创建时间" min-width="170">
          <template #default="{ row }">{{
            formatDate(row.create_time || row.created_at)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page-no="page"
        :page-size="pageSize"
        @update:current-page="changePage"
        @update:page-size="changePageSize"
      />
    </template>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑科室' : '新增科室'"
      width="520px"
      destroy-on-close
    >
      <el-form label-width="90px">
        <el-form-item label="科室名称" required>
          <el-input v-model.trim="form.name" placeholder="请输入科室名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="科室描述">
          <el-input
            v-model.trim="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入科室描述（选填）"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.sort_order"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
