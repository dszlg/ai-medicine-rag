import request from '@/utils/request'
import { Result } from '@/typings/api/response'
import { HealthRecordCreateDTO, HealthRecordUpdateDTO, HealthRecordVO } from '@/typings/api/record'

/**
 * 获取我的健康记录
 */
export const getMyRecord = (): Promise<Result<HealthRecordVO[]>> => {
  return request.get('/record/my')
}

/**
 * 医生查看患者档案
 */
export const getPatientRecord = (): Promise<Result<HealthRecordVO[]>> => {
  return request.get('/record/doctor/patients')
}

/**
 * 医生可选患者列表（来自预约与咨询）
 */
export const getPatientList = (): Promise<Result<{ id: number; name: string }[]>> => {
  return request.get('/record/doctor/patient-options')
}

/**
 * 医生创建患者档案
 */
export const createPatientRecord = (data: HealthRecordCreateDTO): Promise<Result> => {
  return request.post('/record/doctor/create', data)
}

/**
 * 医生更新患者档案
 */
export const updatePatientRecord = (id: number, data: HealthRecordUpdateDTO): Promise<Result> => {
  return request.put(`/record/doctor/${id}`, data)
}

/**
 * 医生删除患者档案
 */
export const deletePatientRecord = (id: number): Promise<Result> => {
  return request.delete(`/record/doctor/${id}`)
}
