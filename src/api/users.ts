import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { UserVO, UserCreateDTO, UserUpdateDTO } from '@/typings/api/user'

/**
 * 获取用户列表
 */
export const getUserList = (
  keyword: string = '',
  page: number = 1,
  page_size: number = 10
): Promise<PageResult<UserVO>> => {
  return request.get('/user/list', {
    params: {
      keyword,
      page_num: page,
      page_size
    }
  })
}

/**
 * 创建用户
 */
export const createUser = (data: UserCreateDTO): Promise<Result> => {
  return request.post('/user/create', data)
}

/**
 * 更新用户
 */
export const updateUser = (id: number, data: UserUpdateDTO): Promise<Result> => {
  return request.put(`/user/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUser = (id: number): Promise<Result> => {
  return request.delete(`/user/${id}`)
}
