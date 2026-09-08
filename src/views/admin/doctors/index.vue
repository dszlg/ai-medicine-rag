<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { formatDate } from '@/utils/day'
import { DoctorVO, DoctorCreateDTO } from '@/typings/api/doctor'
import { getAdminDoctorList, deleteDoctor, updateDoctor, createDoctor } from '@/api/doctor'
import { DepartmentVO } from '@/typings/api/department'

const data = ref<DoctorVO[]>([])
const departments = ref<DepartmentVO[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const id = ref(0)

const form = reactive<DoctorCreateDTO>({
  username: '',
  password: '',
  confirm_password: '',
  real_name: '',
  department_id: null,
  title: '',
  specialty: '',
  introduction: '',
  phone: '',
  status: 1
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: _total } = await getAdminDoctorList(
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
  if (keyword.value !== '') return
  page.value = 1
  keyword.value = ''
  loadData()
}

const openDialog = () => {
  form.username = ''
  form.password = ''
  form.confirm_password = ''
  form.real_name = ''
  form.department_id = null
  form.title = ''
  form.specialty = ''
  form.introduction = ''
  form.phone = ''
  form.status = 1
  isEdit.value = false
  dialogVisible.value = true
}

const openEdit = (row: DoctorVO) => {
  isEdit.value = true
  id.value = row.id
  form.username = row.username
  form.real_name = row.real_name
  form.department_id = row.department_id
  form.title = row.title
  form.specialty = row.specialty
  form.introduction = row.introduction
  form.phone = row.phone
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = async (row: DoctorVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除医生「${row.real_name || row.username}」吗？删除后相关问诊、预约等数据也将一并清除。`,
      '提示',
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    )
    await deleteDoctor(row.id)
    ElMessage.success('删除成功')
    if (data.value.length === 1 && page.value > 1) {
      page.value -= 1
    }
    loadData()
  } catch {
    /* */
  }
}

const submitForm = async () => {
  if (!isEdit.value) {
    if (!form.username?.trim()) {
      ElMessage.warning('请输入用户名')
      return
    }
    if (form.username.trim().length < 3) {
      ElMessage.warning('用户名至少3个字符')
      return
    }
    if (!form.real_name?.trim()) {
      ElMessage.warning('请输入医生姓名')
      return
    }
    if (!form.password) {
      ElMessage.warning('请输入密码')
      return
    }
    if (form.password.length < 6) {
      ElMessage.warning('密码至少6个字符')
      return
    }
    if (form.password !== form.confirm_password) {
      ElMessage.warning('两次密码输入不一致')
      return
    }
  } else if (form.password) {
    if (form.password.length < 6) {
      ElMessage.warning('密码至少6个字符')
      return
    }
    if (form.password !== form.confirm_password) {
      ElMessage.warning('两次密码输入不一致')
      return
    }
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await updateDoctor(id.value, form)
      ElMessage.success('更新成功')
    } else {
      await createDoctor(form)
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

/** 切换医生状态 */
async function toggleStatus(row: DoctorVO) {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(
      `确定${action}医生「${row.real_name || row.username}」吗？`,
      '提示',
      { type: 'warning', cancelButtonText: '取消', confirmButtonText: '确定' }
    )
    await updateDoctor(row.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
    loadData()
  } catch {
    /* */
  }
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  loadData()
}
const handlePageChange = (val: number) => {
  page.value = val
  loadData()
}
</script>

<template>
  <div class="card">
    <!-- 搜索表单 -->
    <div class="flx-justify-between mb12">
      <div class="left">
        <el-input
          v-model.trim="keyword"
          placeholder="搜索用户名 / 姓名 / 手机号 / 职称"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" class="ml12" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="openDialog">新增医生</el-button>
    </div>

    <el-empty v-if="!loading && !data.length" description="暂无医生数据" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="real_name" label="姓名" min-width="100" />
      <el-table-column prop="department_name" label="科室" min-width="120" />
      <el-table-column prop="title" label="职称" min-width="100" />
      <el-table-column prop="phone" label="手机号" min-width="130" />
      <el-table-column prop="status" label="状态" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time || row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button
            link
            :type="row.status === 1 ? 'warning' : 'success'"
            @click="toggleStatus(row)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-no="page"
      :page-size="pageSize"
      :total="total"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑医生' : '新增医生'"
      width="560px"
      destroy-on-close
    >
      <el-form label-width="90px">
        <el-form-item label="用户名" required>
          <el-input
            v-if="!isEdit"
            v-model="form.username"
            placeholder="请输入登录账号"
            maxlength="50"
          />
          <el-input v-else :model-value="form.username" disabled />
        </el-form-item>
        <el-form-item :label="isEdit ? '新密码' : '密码'" :required="!isEdit">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="isEdit ? '不修改请留空' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item :label="isEdit ? '确认新密码' : '确认密码'" :required="!isEdit">
          <el-input
            v-model="form.confirm_password"
            type="password"
            show-password
            :placeholder="isEdit ? '不修改请留空' : '请再次输入密码'"
          />
        </el-form-item>
        <el-form-item label="医生姓名" required>
          <el-input v-model="form.real_name" placeholder="请输入医生姓名" maxlength="50" />
        </el-form-item>
        <el-form-item label="所属科室">
          <el-select
            v-model="form.department_id"
            placeholder="请选择科室"
            clearable
            style="width: 100%"
          >
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="form.title" placeholder="如：主任医师" maxlength="50" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="20" />
        </el-form-item>
        <el-form-item label="擅长领域">
          <el-input v-model="form.specialty" placeholder="请输入擅长领域" maxlength="255" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="form.introduction"
            type="textarea"
            :rows="3"
            placeholder="请输入个人简介（选填）"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
