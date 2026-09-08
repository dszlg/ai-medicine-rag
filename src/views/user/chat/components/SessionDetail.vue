<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { MessageVO } from '@/typings/api/chat'

defineProps<{
  messages: MessageVO[]
  isThinking: boolean
}>()

const markdown = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true
})

const renderMarkdown = (content: string) => markdown.render(content)
</script>

<template>
  <div v-for="(msg, idx) in messages" :key="idx" class="message" :class="msg.role">
    <div class="message-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
    <div class="message-bubble">
      <template v-if="msg.role === 'assistant'">
        <div v-if="isThinking && idx === messages.length - 1" class="typing-indicator">
          <span />
          <span />
          <span />
        </div>
        <div v-else class="markdown-body" v-html="renderMarkdown(msg.content)" />
      </template>
      <template v-else>
        <div>{{ msg.content }}</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  &.user {
    flex-direction: row-reverse;
    .message-bubble {
      color: #ffffff;
      background: $primary-color;
      border-top-right-radius: 4px;
    }
  }
  .message-avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 24px;
    font-size: 20px;
    border-radius: 50%;
  }
  .message-bubble {
    max-width: 70%;
    padding: 12px 16px;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
    border-radius: 12px;
  }
  .markdown-body {
    :deep(p) {
      margin: 0 0 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin: 14px 0 6px;
      font-weight: 600;
      line-height: 1.4;
      &:first-child {
        margin-top: 0;
      }
    }
    :deep(ul),
    :deep(ol) {
      padding-left: 22px;
      margin: 6px 0;
    }
    :deep(li) {
      margin: 3px 0;
    }
    :deep(blockquote) {
      padding: 4px 12px;
      margin: 8px 0;
      color: #64748b;
      border-left: 3px solid #cbd5e1;
    }
    :deep(code) {
      padding: 2px 5px;
      font-size: 0.9em;
      color: #be185d;
      background: rgb(15 23 42 / 8%);
      border-radius: 4px;
    }
    :deep(pre) {
      padding: 12px;
      margin: 10px 0;
      overflow-x: auto;
      color: #e2e8f0;
      background: #1e293b;
      border-radius: 8px;
      code {
        padding: 0;
        font-size: 13px;
        color: inherit;
        background: transparent;
      }
    }
    :deep(a) {
      color: inherit;
      text-decoration: underline;
    }
    :deep(table) {
      display: block;
      width: max-content;
      max-width: 100%;
      margin: 10px 0;
      overflow-x: auto;
      border-collapse: collapse;
    }
    :deep(th),
    :deep(td) {
      padding: 6px 10px;
      border: 1px solid rgb(148 163 184 / 40%);
    }
    :deep(th) {
      font-weight: 600;
      background: rgb(148 163 184 / 12%);
    }
  }
  &.assistant .message-bubble {
    color: #1e293b;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top-left-radius: 4px;
  }
}
.typing-indicator {
  display: flex;
  gap: 4px;
  justify-content: center;
  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #94a3b8;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  span:nth-child(1) {
    animation-delay: -0.32s;
  }
  span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
}
</style>
