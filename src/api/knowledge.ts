import request from '@/utils/request'
import { Result, PageResult } from '@/typings/api/response'
import { KnowledgeVO } from '@/typings/api/knowledge'

/**
 * 知识库文件列表（支持按文件名、类型搜索）
 */
export const getFileList = (
  page: number = 1,
  page_size: number = 10,
  keyword: string = ''
): Promise<PageResult<KnowledgeVO>> => {
  return request.get('/knowledge/list', {
    params: {
      page,
      page_size,
      keyword
    }
  })
}

export const uploadFile = (file: FormData): Promise<Result<{ id: number; file_name: string }>> => {
  return request.post('/knowledge/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteFile = (id: number): Promise<Result> => {
  return request.delete(`/knowledge/${id}`)
}

// export const revectorize = (id: number): Promise<Result> => {

// }
