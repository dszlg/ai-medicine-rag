import request from '@/utils/request'
import { Result } from '@/typings/api/response'
import { LoginVO, RegisterVO, LoginResultVO } from '@/typings/api/login'

/**
 * 账号密码登录
 */
export const loginAPI = async (data: LoginVO): Promise<Result<LoginResultVO>> => {
  return request.post('/auth/login', data)
}

/**
 * 注册
 */
export const registerAPI = async (data: RegisterVO): Promise<Result<LoginResultVO>> => {
  return request.post('/auth/register', data)
}
