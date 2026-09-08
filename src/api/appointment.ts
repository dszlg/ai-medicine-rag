import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { AppointmentCreateDTO, AppointmentVO } from '@/typings/api/appointment'
import { statusType } from '@/typings/global'

/**
 * 创建预约
 */
export const createAppointment = (data: AppointmentCreateDTO): Promise<Result<{ id: number }>> => {
  return request.post('/appointment/create', data)
}

/**
 * 我的预约
 */
export const getMyAppointment = (): Promise<Result<AppointmentVO[]>> => {
  return request.get('/appointment/my')
}

/**
 * 医生的预约
 */
export const getDoctorAppointment = (): Promise<Result<AppointmentVO[]>> => {
  return request.get('/appointment/doctor/my')
}

/**
 * 管理员预约列表，支持模糊搜索与分页
 * @param page 页码
 * @param page_size 每页数量
 * @param keyword 关键字
 * @param department_id 部门
 * @param visit_date 预约日期
 * @param status 状态
 */
export const getAdminAppointment = (
  page: number = 1,
  page_size: number = 10,
  keyword: string = '',
  department_id?: number,
  visit_date?: string,
  status?: statusType
): Promise<PageResult<AppointmentVO>> => {
  return request.get(`/appointment/admin/list`, {
    params: {
      page,
      page_size,
      keyword,
      department_id,
      visit_date,
      status
    }
  })
}

/**
 * 管理员删除预约记录
 */
export const deleteAppointment = (id: number): Promise<Result> => {
  return request.delete(`/appointment/admin/${id}`)
}

/**
 * 更新预约状态
 */
export const updateAppointmentStatus = (id: number, status: number): Promise<Result> => {
  return request.put(`/appointment/${id}/status`, { status })
}
