import { statusType } from '../global'

/**
 * 创建预约
 */
export interface AppointmentCreateDTO {
  doctor_id: number | null
  department_id: number | null
  visit_date: string // ISO 日期字符串，如 "2026-08-28"
  time_slot: string // 例如 "09:00-09:30"
  remark?: string | null
}

/**
 * 预约输出（包含额外字段）
 */
// export interface AppointmentVO {
//   id: number
//   doctor_id: number
//   department_id: number
//   visit_date: Date // ISO 日期字符串，如 "2026-08-28"
//   status: statusType
//   create_time: Date
// }

export interface AppointmentVO {
  id: number
  user_id: number
  user_name?: string | null
  doctor_id: number
  doctor_name?: string | null
  department_id: number
  department_name?: string | null
  visit_date: Date // ISO 日期字符串
  time_slot: string
  status: statusType // 默认为 0（如：0-待就诊，1-已完成等）
  remark?: string | null
  create_time?: Date | null // ISO 日期时间字符串，如 "2026-08-28T10:00:00Z"
}
