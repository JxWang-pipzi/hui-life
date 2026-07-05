import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { mockAdapter } from '@/mock/server'
import { getToken, removeStoredUser, removeToken } from './storage'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
})

if (import.meta.env.VITE_USE_MOCK === 'true') {
  request.defaults.adapter = mockAdapter
}

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const result = response.data

    if (result.code !== 0) {
      ElMessage.error(result.message || '请求失败')
      return Promise.reject(result)
    }

    return result.data
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      removeStoredUser()
      router.push('/login')
      ElMessage.warning('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.message || '网络异常')
    }

    return Promise.reject(error)
  },
)

export default request
