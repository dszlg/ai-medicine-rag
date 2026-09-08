<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { MessageVO } from '@/typings/api/chat.js'
import { getSessionMessage, chatSend } from '@/api/chat'
import HistoryChat from './components/HistoryChat.vue'
import SessionDetail from './components/SessionDetail.vue'

const messages = ref<MessageVO[]>([])
const isThinking = ref(false) // 思考中
const isLoading = ref(false)
const loadFailed = ref(false)
const inputText = ref('')
const currentSessionId = ref<number | null>(null)
const historyChatRef = ref<InstanceType<typeof HistoryChat> | null>(null)
const chatContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  currentSessionId.value = Number(sessionStorage.getItem('currentSessionId'))
  if (currentSessionId.value) {
    loadSessionMessages(currentSessionId.value)
  }
})

const scrollToBottom = async () => {
  await nextTick()
  const container = chatContainerRef.value
  if (container) {
    container.scrollTo({
      top: container.scrollHeight
    })
  }
}

// 新建会话
const newSession = () => {
  currentSessionId.value = null
  messages.value = []
  inputText.value = ''
  isThinking.value = false
}

// 选择会话加载消息
const loadSessionMessages = async (id: number) => {
  isLoading.value = true
  loadFailed.value = false
  inputText.value = ''
  try {
    const res = await getSessionMessage(id)
    messages.value = res.data || []
    currentSessionId.value = id
    // 记录下当前的session_id
    sessionStorage.setItem('currentSessionId', id.toString())
    await scrollToBottom()
  } catch {
    currentSessionId.value = null
    messages.value = []
    loadFailed.value = true
  } finally {
    isLoading.value = false
  }
}

const sendMessage = async () => {
  // 空字符和加载中不可发送
  if (!inputText.value.trim() || isThinking.value || isLoading.value) return

  isThinking.value = true
  const userMsg: MessageVO = {
    role: 'user',
    content: inputText.value
  }
  const assistantMsg: MessageVO = {
    role: 'assistant',
    content: ''
  }
  messages.value.push(userMsg)
  messages.value.push(assistantMsg)
  inputText.value = ''
  scrollToBottom()

  chatSend(
    { message: userMsg.content, session_id: currentSessionId.value },
    (msg: string) => {
      isThinking.value = false
      messages.value.findLast(item => (item.content += msg))
      scrollToBottom()
    },
    async () => {
      // isThinking.value = false
      // 加载消息列表和最新的session_id
      const sessionId = await historyChatRef.value?.loadSessionList()
      currentSessionId.value = sessionId ?? null
    }
  )
}
</script>

<template>
  <div class="chat">
    <!-- 会话历史 -->
    <HistoryChat
      ref="historyChatRef"
      @session-selected="loadSessionMessages"
      @new-session="newSession"
    />

    <!-- 聊天主内容 -->
    <div class="chat-main card">
      <div ref="chatContainerRef" class="chat-messages" v-loading="isLoading">
        <div v-if="!messages.length && !loadFailed && !isLoading" class="chat-welcome">
          <span class="welcome-icon">🤖</span>
          <h2>AI 智能问诊助手</h2>
          <p>描述您的症状，我将为您提供初步的健康建议</p>
        </div>
        <div v-if="loadFailed">出错了，请稍后重试<el-button>重试</el-button></div>
        <SessionDetail :messages="messages" :is-thinking="isThinking" />
        <!-- <div v-if="sending" class="typing-indicator"><span></span><span></span><span></span></div> -->
      </div>
      <div class="chat-input">
        <el-input
          v-model="inputText"
          :rows="2"
          placeholder="请描述您的症状或健康问题..."
          @keydown.enter.exact.prevent="sendMessage"
        />
        <el-button
          type="primary"
          class="gradient-btn send-btn"
          :loading="isThinking"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  display: flex;
  height: 100%;
  .chat-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
    .chat-messages {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      .chat-welcome {
        padding: 60px 20px;
        text-align: center;
        .welcome-icon {
          font-size: 64px;
        }
      }
    }
    .chat-input {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      padding: 16px;
      border-top: 1px solid $border-color;
    }
  }
}
</style>
