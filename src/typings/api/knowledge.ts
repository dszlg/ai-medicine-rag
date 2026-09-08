export type VectorStatus = 1 | 2 | 3

export interface KnowledgeVO {
  id: number
  file_name: string
  file_type: string
  file_size: number
  chunk_count: number
  vector_status: VectorStatus
  create_time: Date
}
