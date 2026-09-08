import request from '@/utils/request'
import type { Result } from '@/typings/api/response'
import { ProfileVO, ProfileUpdateDTO } from '@/typings/api/profile'

/**
 * 获取用户信息
 */
export const getProfile = (): Promise<Result<ProfileVO>> => {
  return request.get('/profile/info')
}

/**
 * 更新用户信息
 */
export const updateProfile = (data: ProfileUpdateDTO): Promise<Result<ProfileVO>> => {
  return request.post('/profile/update', data)
}

export const updatePassword = (data: {
  old_password: string
  new_password: string
}): Promise<Result<ProfileVO>> => {
  return request.put('/profile/password', data)
}

export const updateAvatar = (file: FormData): Promise<Result<{ avatar: string }>> => {
  return request.post('/profile/avatar', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
