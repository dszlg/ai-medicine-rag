export interface ProfileVO {
  user_id: number
  username: string
  role: string
  avatar: string
  phone: string
  create_time: string
}

export interface ProfileUpdateDTO {
  nickname?: string | null
  real_name?: string | null
  phone?: string | null
  email?: string | null
  gender?: 1 | 2
  age?: number | null
  allergy_history?: string | null
  title?: string | null
  specialty?: string | null
  introduction?: string | null
}
