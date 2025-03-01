import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { showFailToast } from 'vant'
const instance = axios.create({
  baseURL: 'http://192.168.10.5:7009/api/',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})
instance.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    if (userStore.token) {
      // console.log('111', userStore.token)
      // config.headers['token'] = userStore.token
      // Authorization 是 HTTP 请求头中的一个标准字段，用于向服务器传递客户端身份凭证。它是实现认证/授权机制的核心传输通道。
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    console.log(error)
    return Promise.reject(error)
  },
)
instance.interceptors.response.use((res) => {
  // console.log('111', res)
  if (typeof res.data !== 'object') {
    showFailToast('请求失败')
    console.log(Promise.reject(res))
    return Promise.reject(res)
  }
  if (res.data.code !== 200) {
    if (res.data.msg) showFailToast(res.data.msg)
    if (res.data.code == 401) {
      router.push('/login')
    }
    return Promise.reject(res.data)
  }
  return res.data
})
export default instance
