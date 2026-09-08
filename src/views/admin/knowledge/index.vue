<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { VectorStatus } from '@/typings/api/knowledge'
import { Upload } from '@element-plus/icons-vue'
import { getFileList, uploadFile, deleteFile } from '@/api/knowledge'
import { KnowledgeVO } from '@/typings/api/knowledge'
import { formatDate } from '@/utils/day'
import { UploadRequestOptions } from 'element-plus'

const data = ref<KnowledgeVO[]>([])
const loading = ref(false)
const uploading = ref(false)
/** 搜索关键词 */
const keyword = ref('')
/** 分页参数 */
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
/** 状态轮询定时器 */
let pollTimer: ReturnType<typeof setInterval> | null = null

const vectorStatusMap: Record<VectorStatus, { label: string; type: string }> = {
  1: { label: '处理中', type: 'info' },
  2: { label: '已向量化', type: 'success' },
  3: { label: '失败', type: 'danger' }
}

onMounted(() => {
  loadData()
})

// 监听数据变化，判断是否需要启动轮询
const hasPendingFiles = (data: KnowledgeVO[]): boolean => {
  return data.some(item => item.vector_status === 1)
}

// 开启轮询
const startPolling = () => {
  if (pollTimer) return
  pollTimer = setInterval(() => {
    refreshList()
  }, 2000)
}

// 关闭轮询
const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getFileList(page.value, pageSize.value, keyword.value)
    data.value = res.list
    total.value = res.total
    if (hasPendingFiles(data.value)) {
      startPolling()
    } else {
      stopPolling()
    }
  } catch (error) {
    console.error('加载文件列表失败', error)
  } finally {
    loading.value = false
  }
}

const refreshList = async () => {
  const res = await getFileList(page.value, pageSize.value, keyword.value)
  data.value = res.list
  total.value = res.total
  if (!hasPendingFiles(data.value)) {
    stopPolling()
  }
}

const handleSearch = () => {
  page.value = 1
  loadData()
}
const handleReset = () => {
  keyword.value = ''
  page.value = 1
  loadData()
}

const handleUpload = ({ file }: UploadRequestOptions): XMLHttpRequest | Promise<unknown> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('未选择文件'))
      return
    }
    uploading.value = true
    const formData = new FormData()
    formData.append('file', file as File)
    uploadFile(formData)
      .then(() => {
        ElMessage.success('上传成功，正在向量化处理')
        page.value = 1
        loadData()
        resolve(null)
      })
      .finally(() => {
        uploading.value = false
      })
  })
}

const handleDelete = async (row: KnowledgeVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除知识库文件「${row.file_name}」吗？删除后不可恢复。`,
      '提示',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }
    )
    await deleteFile(row.id)
    ElMessage.success('删除成功')
    if (data.value.length === 1 && page.value > 1) {
      page.value -= 1
    }
    await loadData()
  } catch {
    /* */
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
    <div class="flx-justify-between mb12">
      <div class="left">
        <el-input
          v-model.trim="keyword"
          placeholder="搜索文件名 / 文件类型"
          clearable
          style="width: 280px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" class="ml12" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-upload
        :show-file-list="false"
        :http-request="handleUpload"
        accept=".txt,.pdf,.doc,.docx,.md"
      >
        <el-button type="primary" class="gradient-btn" :loading="uploading" :icon="Upload">
          上传文件
        </el-button>
      </el-upload>
    </div>

    <el-empty v-if="!loading && !data.length" description="暂无知识库文件" />
    <el-table v-else :data="data" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="file_name" label="文件名" min-width="200" show-overflow-tooltip />
      <el-table-column prop="file_type" label="类型" min-width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.file_type || row.type || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="file_size" label="大小" min-width="100">
        <template #default="{ row }">
          {{
            row.file_size
              ? (row.file_size / 1024).toFixed(1) + ' KB'
              : row.size
                ? (row.size / 1024).toFixed(1) + ' KB'
                : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="vector_status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="vectorStatusMap[row.vector_status].type" size="small">
            {{ vectorStatusMap[row.vector_status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="上传时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time || row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="{ row }">
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
  </div>
</template>
