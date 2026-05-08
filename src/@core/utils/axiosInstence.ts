import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
})

// Attach token automatically
axiosInstance.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('accessToken') ||
        localStorage.getItem('accessToken')
      : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosInstance