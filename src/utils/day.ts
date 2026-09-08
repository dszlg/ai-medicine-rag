import dayjs from 'dayjs'

export const formatDate = (date: Date | string, format: string = 'YYYY年MM月DD日 HH:mm:ss') => {
  return dayjs(date).format(format)
}
