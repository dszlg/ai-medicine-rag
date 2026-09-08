<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import { getArticleList } from '@/api/article'
import { ArticleVO } from '@/typings/api/article'
import { useRouter } from 'vue-router'

const page = ref(1)
const pageSize = ref(10)
const router = useRouter()
const list = ref<ArticleVO[]>([])
const loading = ref(false)

onMounted(async () => {
  loadArticleList()
})

/**
 * 加载文章列表
 */
const loadArticleList = async () => {
  loading.value = true
  try {
    list.value = (await getArticleList('', page.value, pageSize.value)).list
  } finally {
    loading.value = false
  }
}

const viewArticle = (id: number) => {
  router.push(`/articles/${id}`)
}

const changePage = async (val: number) => {
  page.value = val
  loadArticleList()
}
const changePageSize = async (val: number) => {
  pageSize.value = val
  loadArticleList()
}
</script>

<template>
  <div class="articles card">
    <div class="article-container">
      <el-row :gutter="20">
        <el-col v-for="item in list" :key="item.id" :xs="24" :sm="12" :md="8">
          <div class="article-card card" @click="viewArticle(item.id)">
            <h3 class="ellipsis">{{ item.title }}</h3>
            <p class="article-summary">{{ item.summary || item.content?.slice(0, 80) }}</p>
            <div class="article-meta">
              <span>管理员</span>
              <span>{{ formatDate(item.create_time!) }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <pagination
      :total="list.length"
      :page-no="page"
      :page-size="pageSize"
      @update:current-page="changePage"
      @update:page-size="changePageSize"
    />
    <el-empty v-if="!loading && !list.length" description="暂无文章" />
  </div>
</template>

<style scoped lang="scss">
.articles {
  height: 100%;
}
.article-container {
  height: 93%;
  overflow-y: scroll;
}
.article-container::-webkit-scrollbar {
  display: none;
}
.article-card {
  min-width: 240px;
  margin-bottom: 20px;
  cursor: pointer;
}
.article-card h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
}
.article-summary {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: $text-color;
}
.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $text-color;
}
</style>
