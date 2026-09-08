import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { NoticeVO, NoticeCreateDTO } from '@/typings/api/notice'

/**
 * 获取公告列表
 */
export const getNoticeList = (): Promise<Result<NoticeVO[]>> => {
  return request.get(`/notice/list`)
}

/**
 * 获取后台公告管理列表
 */
export const getAdminNoticeList = (
  page: number = 1,
  pageSize: number = 10,
  keyword?: string
): Promise<PageResult<NoticeVO>> => {
  return request.get(`/notice/admin/list?page=${page}&page_size=${pageSize}&keyword=${keyword}`)
}

/**
 * 获取公告详情
 */
export const getNoticeDetail = (id: number): Promise<Result<NoticeVO>> => {
  return request.get(`/notice/${id}`)
}

/**
 * 创建公告
 */
export const createNotice = (data: NoticeCreateDTO): Promise<Result<{ id: number }>> => {
  return request.post('/notice/create', data)
}

/**
 * 修改公告
 */
export const updateNotice = (id: number, data: NoticeCreateDTO): Promise<Result> => {
  return request.put(`/notice/${id}`, data)
}

/**
 * 删除公告
 */
export const deleteNotice = (id: number): Promise<Result> => {
  return request.delete(`/notice/${id}`)
}
