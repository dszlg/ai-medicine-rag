import { statusType } from '../global'

export interface NoticeVO {
  id: number
  title: string
  content?: string
  status: statusType
  create_time?: Date | null
}

export interface NoticeCreateDTO {
  title: string
  content: string
  status: statusType
}
