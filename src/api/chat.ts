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
export type OnError = (error: Error) => void
/**
 * 发送消息
 */
export const chatSend = async (
  data: ChatRequestDTO,
  onMessage: OnMessage,
  onComplete?: OnComplete,
  onError?: OnError,
  abort?: AbortController
) => {
  const userStore = useUserStore()

  // 设置连续无响应超时时间，收到数据后重新计时
  let timer: number | null = null

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  // 请求建立和收到数据后开始计时
  const resetTimer = () => {
    clearTimer()
    timer = window.setTimeout(() => {
      try {
        abort?.abort()
        timer = null
        throw new Error('timeout')
      } catch (err: Error | any) {
        onError?.(err)
      }
    }, 1000)
  }

  try {
    resetTimer()
    const response = await fetch(import.meta.env.VITE_API_URL + '/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userStore.getToken
      },
      body: JSON.stringify(data),
      signal: abort?.signal
    })

    if (!response.ok) {
      throw new Error(`请求失败，状态码：${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取可读流')
    }

    abort?.signal.addEventListener(
      'abort',
      () => {
        void reader.cancel()
      },
      { once: true }
    )

    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      resetTimer()
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.trim().split('\n')
      for (const line of lines) {
        if (line === '') continue
        const data = JSON.parse(line.replace(/data: /g, ''))

        // 发送内容
        if (data.type === 'content') {
          onMessage(data.content)
        }

        // 发送完成
        if (data.type === 'done') {
          onComplete?.()
          clearTimer()
        }
      }
    }
    clearTimer()
  } catch (error: Error | any) {
    clearTimer()
    onError?.(error)
  }
}
