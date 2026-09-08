/**
 * 登录提交信息
 */
export interface LoginVO {
  username: string
  password: string
  role: 'user' | 'admin' | 'doctor'
}

/**
 * 注册提交信息
 */
export interface RegisterVO {
  username: string
  password: string
  confirm_password: string
  real_name?: string | null
  phone?: string | null
}

/**
 * 登录响应信息
 */
export interface LoginResultVO {
  access_token: string
  token_type: string
  role: string
  user_id: number
  username: string
  nickname?: string | null
  avatar?: string | null
}
