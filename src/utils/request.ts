import axios from 'axios'
import { useUserStoreWithOut } from '@/stores/modules/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    try {
      const userStore = useUserStoreWithOut()
      const token = userStore.getToken
      if (token) {
        config.headers.Authorization = 'Bearer ' + token
      }
    } catch (e) {
      // Pinia may not be ready yet or other error — silently ignore and proceed
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (res) {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = res.data.msg || '发生异常'
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return Promise.resolve(res.data)
    }
  },
  function (error) {
    let {
      status,
      data: { msg }
    } = error.response

    if (status === 401) {
      ElMessage({ message: msg, type: 'error' })
    } else {
      ElMessage({ message: '发生异常，请联系管理员', type: 'error' })
    }
    return Promise.reject(error)
  }
)

export default request
