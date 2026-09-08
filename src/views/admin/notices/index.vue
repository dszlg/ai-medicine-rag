<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { getAdminNoticeList, deleteNotice, createNotice, updateNotice } from '@/api/notice'
import { NoticeVO, NoticeCreateDTO } from '@/typings/api/notice'
import { formatDate } from '@/utils/day'

const data = ref<NoticeVO[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const id = ref(0)

const form = reactive<NoticeCreateDTO>({
  title: '',
  content: '',
  status: 1
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getAdminNoticeList(
      page.value,
      pageSize.value,
      keyword.value
    )
    data.value = list
    total.value = totalCount
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
  keyword.value = ''
  page.value = 1
  loadData()
}
const openCreate = () => {
  form.title = ''
  form.content = ''
  form.status = 1
  isEdit.value = false
  dialogVisible.value = true
}

const openEdit = (row: NoticeVO) => {
  isEdit.value = true
  id.value = row.id
  form.title = row.title
  form.content = row.content ?? ''
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = async (row: NoticeVO) => {
  try {
    await ElMessageBox.confirm(`确定删除公告「${row.title}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await deleteNotice(row.id)
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
  if (!form.title?.trim()) {
    ElMessage.warning('请输入公告标题')
    return
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await updateNotice(id.value, form)
      ElMessage.success('更新成功')
    } else {
      await createNotice(form)
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
</script>

<template>
  <div class="card">
    <header class="flx-justify-between mb12">
      <div class="left">
        <el-input
          v-model.trim="keyword"
          placeholder="搜索标题 / 内容"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" class="ml12" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="openCreate">新增公告</el-button>
    </header>

    <!-- 表格 -->
    <el-empty v-if="!loading && !data.length" description="暂无公告数据" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" min-width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '已发布' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发布时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time || row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公告' : '新增公告'"
      width="600px"
      destroy-on-close
    >
      <el-form label-width="80px">
        <el-form-item label="标题" required>
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">已发布</el-radio>
            <el-radio :value="0">已下架</el-radio>
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
