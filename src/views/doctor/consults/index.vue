<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import { getDoctorPending, doctorReply } from '@/api/consult'
import { DoctorConsultVO } from '@/typings/api/consult'

const list = ref<DoctorConsultVO[]>([])
const loading = ref(false)
const replyDialog = ref(false)
const currentItem = ref<DoctorConsultVO | null>(null)
const replyText = ref('')

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getDoctorPending()
    list.value = res.data || []
  } finally {
    loading.value = false
  }
}

/** 解析主诉为标题与咨询内容（格式：标题：内容） */
function parseComplaint(chiefComplaint) {
  const text = chiefComplaint || ''
  const idx = text.indexOf('：')
  if (idx > 0) {
    return { title: text.slice(0, idx), content: text.slice(idx + 1) }
  }
  return { title: text, content: '' }
}

const openReply = (row: DoctorConsultVO) => {
  currentItem.value = row
  console.log('openReply', row)
  replyText.value = ''
  replyDialog.value = true
}

const submitReply = async () => {
  if (!replyText.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  try {
    const { msg } = await doctorReply({
      consult_id: currentItem.value?.id as number,
      content: replyText.value
    })
    ElMessage.success(msg)
    replyDialog.value = false
    loadData()
  } catch {
    /* */
  }
}
</script>
<template>
  <div class="card">
    <el-empty v-if="!loading && !list.length" description="暂无咨询数据" />
    <el-table v-else :data="list" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column label="标题" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ parseComplaint(row.chief_complaint).title }}</template>
      </el-table-column>
      <el-table-column prop="user_name" label="患者" min-width="100" />
      <el-table-column label="咨询内容" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">{{ parseComplaint(row.chief_complaint).content }}</template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openReply(row)">回复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="replyDialog" title="回复咨询" width="520px">
      <el-input v-model="replyText" type="textarea" :rows="5" placeholder="请输入回复内容" />
      <template #footer>
        <el-button @click="replyDialog = false">取消</el-button>
        <el-button type="primary" class="gradient-btn" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>
