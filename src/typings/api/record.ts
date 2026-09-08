/**
 * 创建健康档案
 */
export interface HealthRecordCreateDTO {
  user_id: number | null
  record_type: string
  diagnosis?: string
  treatment?: string
  prescription?: string | null
  visit_date?: Date | null
}

/**
 * 更新健康档案
 */
export interface HealthRecordUpdateDTO {
  record_type?: string | null
  diagnosis?: string | null
  treatment?: string | null
  prescription?: string | null
  visit_date?: Date | null
}

/**
 * 健康档案输出（包含额外字段）
 */
export interface HealthRecordVO {
  id: number
  user_id: number
  user_name?: string | null
  doctor_id?: number | null
  doctor_name?: string | null
  record_type?: string | null
  diagnosis?: string | null
  treatment?: string | null
  prescription?: string | null
  visit_date?: Date | null // ISO 日期字符串
  create_time?: Date | null
  create_at?: Date | null
}
