import axios from 'axios'
// 开发环境用于webpack-devServer的proxy，/api开头
const DEV_BASE_URL = 'http://localhost:9111/api'
// 生产环境后端真实地址
const Production_BASE_URL = 'http://localhost:3000'
const request = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? Production_BASE_URL : DEV_BASE_URL
})

request.interceptors.request.use(config => {
  // config.withCredentials = true;
  return config
})

request.interceptors.response.use(
  res => {
    // ...
    return Promise.resolve(res)
  },
  err => {
    // ...
    console.log(err)
    return Promise.reject(err)
  }
)

export default request
