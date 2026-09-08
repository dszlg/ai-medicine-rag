import request from '@/utils/request'
import { statusType } from '@/typings/global'
import { Result, PageResult } from '@/typings/api/response'
import {
  UserConsultVO,
  ConsultCreateDTO,
  DoctorReplyDTO,
  DoctorConsultVO
} from '@/typings/api/consult'

/**
 * 患者发起人工问诊
 */
export const createConsult = (data: ConsultCreateDTO): Promise<Result<{ id: number }>> =>
  request.post('/consult/create', data)

/**
 * 患者查看自己的问诊
 */
export const getMyConsult = (): Promise<Result<UserConsultVO[]>> => {
  return request.get('/consult/my')
}

/**
 * 医生待回复列表
 */
export const getDoctorPending = (): Promise<Result<DoctorConsultVO[]>> =>
  request.get('/consult/doctor/pending')

/**
 * 医生回复
 */
export const doctorReply = (data: DoctorReplyDTO): Promise<Result> =>
  request.post('/consult/reply', data)

/**
 * 管理员工单列表（支持搜索与分页）
 */
export const getAdminConsultList = (
  keyword: string = '',
  page: number = 1,
  pageSize: number = 10,
  status?: statusType
): Promise<PageResult<UserConsultVO>> =>
  request.get('/consult/admin/list', {
    params: {
      keyword,
      page,
      pageSize,
      status
    }
  })

/**
 * 管理员删除咨询工单
 */
export const deleteConsult = (id: number): Promise<Result> => request.delete(`/consult/admin/${id}`)
