import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const isDev = import.meta.env.DEV

const request = axios.create({
  baseURL: 'https://qingping-wallpaper-api.1628973345.workers.dev',
  timeout: 30000
})

request.interceptors.request.use(
  config => {
    const adminStore = useAdminStore()
    if (adminStore.token) {
      config.headers.Authorization = adminStore.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.errCode === 0) {
      return res
    } else if (res.errCode === 401) {
      ElMessage.error('登录已过期，请重新登录')
      const adminStore = useAdminStore()
      adminStore.logout()
      window.location.href = '/login'
      return Promise.reject(new Error('登录已过期'))
    } else {
      ElMessage.error(res.errMsg || '请求失败')
      return Promise.reject(new Error(res.errMsg || '请求失败'))
    }
  },
  error => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request