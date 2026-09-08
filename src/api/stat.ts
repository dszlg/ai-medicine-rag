import request from '@/utils/request'
import { Result } from '@/typings/api/response'
import { UserStatVO, AdminStatVO, DoctorStatVO } from '@/typings/api/stat'

/**
 * 用户个人统计概览
 */
export const getUserOverview = (): Promise<Result<UserStatVO>> => {
  return request.get('/stat/user-overview')
}

/**
 * 医生统计概览
 */
export const getDoctorOverview = (): Promise<Result<DoctorStatVO>> => {
  return request.get('/stat/doctor-overview')
}

/**
 * 管理员统计概览
 */
export const getAdminOverview = (): Promise<Result<AdminStatVO>> => {
  return request.get('/stat/admin-overview')
}

/**
 * 问诊趋势（近N天）
 */
export const getConsultTrend = (
  start_date: string,
  end_date: string
): Promise<Result<[{ date: string; count: number }]>> => {
  return request.get('/stat/consult-trend', {
    params: {
      start_date,
      end_date
    }
  })
}

/**
 * 科室预约分布
 */
export const getDepartmentDistribution = (): Promise<Result<[{ name: string; value: number }]>> => {
  return request.get('/stat/appointment-dept')
}

/**
 * 用户增长
 */
export const getUserGrowth = (
  days: number = 7
): Promise<Result<[{ date: string; count: number }]>> => {
  return request.get('/stat/user-growth', {
    params: {
      days
    }
  })
}

/**
 * 知识库类型分布
 */
export const getKnowledgeType = (): Promise<Result<[{ name: string; value: number }]>> => {
  return request.get('/stat/knowledge-type')
}
