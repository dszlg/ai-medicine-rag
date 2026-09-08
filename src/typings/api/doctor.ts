import { D } from 'vue-router/dist/router-CWoNjPRp.mjs'
import { statusType } from '../global'

/**
 * 医生输出（包含完整信息）
 */
export interface DoctorVO {
  id: number
  username: string
  real_name: string
  department_id?: number | null
  department_name?: string | null
  title?: string | null
  specialty?: string | null
  introduction?: string | null
  avatar?: string | null
  phone?: string | null
  status: statusType // 默认 1
  create_time?: Date | null // ISO 日期时间字符串
}

/**
 * 管理员创建医生（包含密码和确认密码）
 */
export interface DoctorCreateDTO {
  username: string // 3-50 字符
  password: string // 至少6位
  confirm_password: string // 至少6位，需与password一致（前端校验）
  real_name: string // 1-50 字符
  department_id?: number | null
  title?: string | null
  specialty?: string | null
  introduction?: string | null
  phone?: string | null
  status?: statusType // 可选，默认 1
}

/**
 * 管理员更新医生（所有字段可选）
 */
export interface DoctorUpdateDTO {
  real_name?: string | null
  department_id?: number | null
  title?: string | null
  specialty?: string | null
  introduction?: string | null
  phone?: string | null
  status?: statusType | null
  password?: string | null
  confirm_password?: string | null
}
