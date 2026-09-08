export interface ChatRequestDTO {
  session_id?: number | null
  message: string
}

export interface SessionVO {
  id: number
  title: string
  message_count: number
  create_time: Date
  update_time: Date
}

export interface MessageVO {
  id?: number
  session_id?: number
  role: 'user' | 'assistant'
  content: string
  references_json?: string
  graph_json?: string
  create_time?: Date | null
}
