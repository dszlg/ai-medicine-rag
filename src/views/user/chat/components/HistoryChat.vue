<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { formatDate } from '@/utils/day'
import { SessionVO } from '@/typings/api/chat.js'
import { getSessionList } from '@/api/chat'

const emit = defineEmits<{
  (e: 'sessionSelected', sessionId: number): void
  (e: 'newSession'): void
}>()

defineExpose({
  loadSessionList: async (): Promise<number | null> => {
    await loadSessions()
    currentSessionId.value = sessions.value[0]?.id ?? null
    return currentSessionId.value
  }
})

const sessions = ref<SessionVO[]>([])
const currentSessionId = ref<number | null>(null)
const loading = ref(false)

onMounted(() => {
  loadSessions()
  currentSessionId.value = Number(sessionStorage.getItem('currentSessionId'))
})

// 加载会话列表
const loadSessions = async () => {
  loading.value = true
  try {
    const res = await getSessionList()
    sessions.value = res.data || []
  } finally {
    loading.value = false
  }
}

// 新建会话
const newSession = () => {
  currentSessionId.value = null
  emit('newSession')
}

// 加载会话消息
const loadMessages = (sessionId: number) => {
  currentSessionId.value = sessionId
  emit('sessionSelected', sessionId)
}
</script>

<template>
  <div class="chat-sidebar card mr12" v-loading="loading">
    <div class="sidebar-header">
      <el-text size="large">对话历史</el-text>
      <el-button type="primary" size="small" class="gradient-btn" icon="Plus" @click="newSession">
        新对话
      </el-button>
    </div>
    <div class="session-list">
      <el-empty v-if="!sessions.length" description="暂无对话" :image-size="60" />
      <div
        v-else
        v-for="s in sessions"
        :key="s.id"
        class="session-item"
        :class="{ active: currentSessionId === s.id }"
        @click="loadMessages(s.id)"
      >
        <el-text class="session-title">{{ s.title || '新对话' }}</el-text>
        <el-text class="session-time">{{ formatDate(s.create_time) }}</el-text>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-sidebar {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 320px;
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .session-list {
    flex: 1;
    overflow-y: auto;
    .session-item {
      position: relative;
      padding: 10px 12px;
      margin-bottom: 4px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s;
      &.active {
        background: var(--el-color-primary-light-8);
      }
      .session-title {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        white-space: nowrap;
      }
      .session-time {
        font-size: 12px;
      }
    }
  }
}
</style>
