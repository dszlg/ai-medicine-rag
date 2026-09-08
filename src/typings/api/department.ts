import { statusType } from '../global'

/**
 * 科室输出（包含完整信息）
 */
export interface DepartmentVO {
  id: number
  name: string
  sort_order: number
  status: statusType
  doctor_count: number
  description?: string | null
  create_time?: Date | null
}

/**
 * 科室创建（用于请求体）
 */
export interface DepartmentCreateDTO {
  name: string
  description?: string | null
  sort_order?: number | null // 可选，默认 0，可省略
}
