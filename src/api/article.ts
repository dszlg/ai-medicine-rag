import request from '@/utils/request'
import { statusType } from '@/typings/global'
import { Result, PageResult } from '@/typings/api/response'
import { ArticleCreateDTO, ArticleVO } from '@/typings/api/article'

/**
 * 文章列表（公开）
 */
export const getArticleList = (
  category: string = '',
  page: number = 1,
  page_size: number = 10
): Promise<PageResult<ArticleVO>> =>
  request.get('/article/list', {
    params: {
      category,
      page,
      page_size
    }
  })

/**
 *  文章管理列表（管理员，含全部状态）
 */
export const getAdminArticleList = (
  keyword: string = '',
  page: number = 1,
  page_size: number = 10
): Promise<PageResult<ArticleVO>> => {
  return request.get('/article/admin/list', {
    params: {
      keyword,
      page,
      page_size
    }
  })
}

/**
 * 文章详情
 */
export const getArticleDetail = (id: number): Promise<Result<ArticleVO>> => {
  return request.get(`/article/${id}`)
}

/**
 * 创建文章
 */
export const createArticle = (data: ArticleCreateDTO): Promise<Result<{ id: number }>> =>
  request.post('/article/create', data)

/**
 * 更新文章
 */
export const updateArticle = (id: number, data: ArticleCreateDTO): Promise<Result> =>
  request.put(`/article/${id}`, data)

/**
 * 删除文章
 */
export const deleteArticle = (id: number): Promise<Result<null>> => {
  return request.delete(`/article/${id}`)
}
