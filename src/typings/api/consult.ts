import { statusType } from '../global'

/**
 * 创建人工问诊
 */
export interface ConsultCreateDTO {
  doctor_id?: number | null // 可选，指定医生ID，可为空
  chief_complaint: string // 主诉，必填
}

/**
 * 医生回复VO
 */
export interface DoctorReplyVO {
  doctor_id?: number | null // 可选，指定医生ID，可为空
  chief_complaint: string // 主诉，必填
}

/**
 * 医生回复DTO
 */
export interface DoctorReplyDTO {
  consult_id: number // 问诊记录ID
  content: string // 回复内容
}

export interface DoctorConsultVO {
  user_name: string
  chief_complaint: string
  create_time: Date
  id: number
  user_id: number
}

/**
 * 人工问诊输出（包含完整信息及关联数据）
 */
export interface UserConsultVO {
  id: number
  user_id: number
  user_name?: string | null
  doctor_id?: number | null
  doctor_name?: string | null
  chief_complaint: string // 主诉
  status: statusType // 状态，默认 0
  create_time?: Date | null // ISO 日期时间字符串
  replies?: any[] | null // 回复列表，类型待定（可替换为 DoctorReplyOut[]）
}
