import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { DoctorCreateDTO, DoctorVO, DoctorUpdateDTO } from '@/typings/api/doctor'

/**
 * 医生列表（公开，患者可选医生）
 */
export const getDoctorList = (
  keyword: string = '',
  page: number = 1,
  page_size: number = 10,
  department_id?: number
): Promise<PageResult<DoctorVO>> => {
  return request.get('/doctor/list', {
    params: {
      keyword,
      page,
      page_size,
      department_id
    }
  })
}

/**
 * 医生管理列表（管理员，支持搜索与分页）
 */
export const getAdminDoctorList = (
  keyword: string = '',
  page: number = 1,
  page_size: number = 10
): Promise<PageResult<DoctorVO>> => {
  return request.get('/doctor/admin/list', {
    params: {
      keyword,
      page,
      page_size
    }
  })
}

/**
 * 管理员创建医生
 */
export const createDoctor = (data: DoctorCreateDTO): Promise<Result<{ id: number }>> =>
  request.post('/doctor/create', data)

/**
 * 管理员更新医生
 */
export const updateDoctor = (id: number, data: DoctorUpdateDTO): Promise<Result> =>
  request.put(`/doctor/${id}`, data)

/**
 * 管理员删除医生
 */
export const deleteDoctor = (id: number): Promise<Result> => request.delete(`/doctor/${id}`)

/**
 * 切换医生状态
 */
export const toggleDoctorStatus = (id: number): Promise<Result> =>
  request.put(`/doctor/${id}/status`)
