<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/day'
import { getNoticeDetail } from '@/api/notice'
import { NoticeVO } from '@/typings/api/notice'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const notice = ref<NoticeVO>()

onMounted(() => {
  loadData()
})

watch(() => route.params.id, loadData)

/** 加载公告详情 */
async function loadData() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await getNoticeDetail(Number(id))
    if (!res.data) {
      ElMessage.warning('公告不存在或已下架')
      router.replace('/home')
      return
    }
    notice.value = res.data
  } catch {
    ElMessage.error('加载公告失败')
    router.replace('/home')
  } finally {
    loading.value = false
  }
}

/** 返回首页 */
function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="card" v-loading="loading">
    <div class="detail-header">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </div>
    <div v-if="notice" class="modern-card detail-card">
      <div class="detail-title-row">
        <el-tag size="small" type="warning">公告</el-tag>
        <h2 class="detail-title">{{ notice.title }}</h2>
      </div>
      <div class="detail-meta">{{ formatDate(notice.create_time!) }}</div>
      <div class="detail-content">{{ notice.content || '暂无内容' }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-header {
  margin-bottom: 16px;
}
.detail-title-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.detail-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}
.detail-meta {
  padding-bottom: 16px;
  margin-bottom: 24px;
  font-size: 13px;
  border-bottom: 1px solid $border-color;
}
.detail-content {
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
