import { statusType } from '../global'

/**
 * 文章输出（包含完整信息）
 */
export interface ArticleVO {
  id: number
  title: string
  category?: string | null
  cover?: string | null // 封面图片 URL
  summary?: string | null
  content?: string | null
  view_count: number // 默认 0，后端总会返回
  status: statusType // 默认 1
  create_time?: Date | null // ISO 日期时间字符串
}

/**
 * 文章创建（不含封面，可能由其他接口单独上传）
 */
export interface ArticleCreateDTO {
  title: string // 必填
  category?: string | null
  summary?: string | null
  content?: string | null
  status?: statusType // 可选，默认 1，可省略
}
