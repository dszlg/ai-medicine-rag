<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import { getAdminArticleList, deleteArticle, createArticle, updateArticle } from '@/api/article'
import { ArticleVO, ArticleCreateDTO } from '@/typings/api/article'

const data = ref<ArticleVO[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const id = ref(0)

const form = reactive<ArticleCreateDTO>({
  title: '',
  category: '',
  summary: '',
  content: '',
  status: 1
})

/** 文章分类选项 */
const categoryOptions = ['健康科普', '疾病预防', '用药指南', '营养饮食', '运动康复', '其他']

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: _total } = await getAdminArticleList(
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
  page.value = 1
  loadData()
}

const handleReset = () => {
  keyword.value = ''
  page.value = 1
  handleSearch()
}

const openCreate = () => {
  form.title = ''
  form.category = ''
  form.content = ''
  form.status = 1
  form.summary = ''
  isEdit.value = false
  dialogVisible.value = true
}

const openEdit = (row: ArticleVO) => {
  id.value = row.id
  isEdit.value = true
  form.category = row.category
  form.title = row.title
  form.summary = row.summary
  form.content = row.content
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = async (row: ArticleVO) => {
  try {
    await ElMessageBox.confirm(`确定删除文章「${row.title}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await deleteArticle(row.id)
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
    ElMessage.warning('请输入文章标题')
    return
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await updateArticle(id.value, form)
      ElMessage.success('更新成功')
    } else {
      await createArticle(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } finally {
    submitting.value = false
  }
}

const handlePageChange = (val: number) => {
  page.value = val
  loadData()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  loadData()
}
</script>

<template>
  <div class="card">
    <header class="flx-justify-between mb12">
      <div class="left">
        <el-input
          v-model.trim="keyword"
          placeholder="搜索标题 / 摘要 / 分类"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-button class="ml12" type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="openCreate">新增文章</el-button>
    </header>

    <!-- 表格 -->
    <el-empty v-if="!loading && !data.length" description="暂无文章数据" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" min-width="100" />
      <el-table-column prop="view_count" label="阅读量" min-width="90" />
      <el-table-column prop="summary" label="摘要" min-width="250" show-overflow-tooltip />
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
      :title="isEdit ? '编辑文章' : '新增文章'"
      width="680px"
      destroy-on-close
    >
      <el-form label-width="80px">
        <el-form-item label="标题" required>
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="form.category"
            placeholder="请选择或输入分类"
            filterable
            allow-create
            clearable
            style="width: 100%"
          >
            <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入文章摘要（选填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入文章内容" />
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

<style scoped></style>
