import { statusType } from '../global'
export type roleType = 'admin' | 'user' | 'doctor'
export type genderType = 1 | 2

export interface UserVO {
  id: number
  status: number
  username: string
  real_name?: string
  gender?: genderType
  age?: number | null
  phone?: string
  avatar?: string
  allergy_history?: string
  create_time?: Date
}

export interface UserCreateDTO {
  username: string
  password: string
  confirm_password: string
  real_name?: string
  gender: genderType
  age?: number | null
  phone?: string
  allergy_history?: string
  status: statusType
}

export interface UserUpdateDTO {
  real_name?: string | null
  gender?: number | null
  age?: number | null
  phone?: string
  allergy_history?: string
  status?: number | null
  password?: string
  confirm_password?: string
}
