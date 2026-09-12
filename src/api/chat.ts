import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { SessionVO, ChatRequestDTO, MessageVO } from '@/typings/api/chat'
import { useUserStore } from '@/stores/modules/user'

/**
 * 获取用户会话列表
 */
export const getSessionList = (): Promise<Result<SessionVO[]>> => {
  return request.get('/chat/sessions')
}

/**
 * 获取会话消息
 */
export const getSessionMessage = (id: number): Promise<Result<MessageVO[]>> => {
  return request.get(`/chat/sessions/${id}/messages`)
}

export type OnMessage = (content: string) => void
export type OnComplete = () => void
export type OnError = (error: any) => void
/**
 * 发送消息
 */
export const chatSend = async (
  data: ChatRequestDTO,
  onMessage: OnMessage,
  onComplete?: OnComplete,
  onError?: OnError
) => {
  const userStore = useUserStore()
  const ctrlAbout = new AbortController()
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userStore.getToken
      },
      signal: ctrlAbout.signal,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`请求失败，状态码：${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取可读流')
    }

    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.trim().split('\n')
      for (const line of lines) {
        if (line === '') continue
        const data = JSON.parse(line.replace(/data: /g, ''))
        if (data.type === 'content') {
          onMessage(data.content)
        }
        if (data.type === 'done') {
          onComplete?.()
        }
      }
    }
  } catch (error) {
    ElMessage.error('发送消息失败，请稍后重试')
    onError?.(error)
  }
}
