<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleDetail } from '@/api/article'
import { ArticleVO } from '@/typings/api/article'
import { formatDate } from '@/utils/day'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const article = ref<ArticleVO>()

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getArticleDetail(Number(route.params.id))
    article.value = data
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  window.history.back()
}
</script>
<template>
  <div class="article-detail card" :v-loading="loading">
    <el-button type="primary" @click="goBack">返回健康资讯</el-button>
    <div v-if="article" class="detail-card">
      <div class="detail-title-row">
        <el-tag size="small" type="success">健康资讯</el-tag>
        <h2 class="detail-title">{{ article.title }}</h2>
      </div>
      <div class="detail-meta">
        <span>{{ '管理员' }}</span>
        <span>{{ formatDate(article.create_time || '') }}</span>
      </div>
      <div class="detail-content" v-html="article.content || '暂无内容'"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 32px;
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
  color: $text-color;
}
.detail-meta {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 24px;
  font-size: 13px;
  color: $text-color;
  border-bottom: 1px solid #f0f0f0;
}
.detail-content {
  font-size: 15px;
  line-height: 1.8;
}
</style>
