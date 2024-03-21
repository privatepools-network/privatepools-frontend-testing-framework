import axios from 'axios'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    Accept: 'application/json',
    credentials: 'same-origin',
  },
})
// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    return config
  },
  (err) => Promise.reject(err),
)


export default axiosInstance
