export interface UserStatVO {
  consult_count: number
  appointment_count: number
  record_count: number
  chat_count: number
}

export interface DoctorStatVO {
  pending_consults: number
  today_appointments: number
  total_patients: number
  replied_consults: number
}

export interface AdminStatVO {
  user_count: number
  doctor_count: number
  consult_count: number
  appointment_count: number
  knowledge_count: number
  article_count: number
}
