export interface Result<T = null> {
  code: number
  msg?: string
  data?: T
}

export interface PageResult<T> {
  page_num: number
  page_size: number
  total: number
  list: T[]
}
