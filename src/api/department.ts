import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { DepartmentVO, DepartmentCreateDTO } from '@/typings/api/department'

/**
 * 获取科室列表
 */
export const getDepartmentList = (): Promise<Result<DepartmentVO[]>> =>
  request.get('/department/list')

/**
 * 科室管理列表（管理员，支持搜索分页）
 */
export const getDepartmentManageList = (
  keyword: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PageResult<DepartmentVO>> =>
  request.get(`/department/admin/list?keyword=${keyword}&page=${page}&page_size=${pageSize}`)

/**
 * 创建科室
 */
export const createDepartment = (data: DepartmentCreateDTO): Promise<Result<{ id: number }>> =>
  request.post('/department/create', data)

/**
 * 更新科室
 */
export const updateDepartment = (id: number, data: DepartmentCreateDTO): Promise<Result> =>
  request.put(`/department/${id}`, data)

/**
 * 删除科室
 */
export const deleteDepartment = (id: number): Promise<Result> => request.delete(`/department/${id}`)
