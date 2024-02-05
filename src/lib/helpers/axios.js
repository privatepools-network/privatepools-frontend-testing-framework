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

// Response interceptor for API calls
// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (response.status === 200 || response.status === 201) {
//       return Promise.resolve(response.data)
//     } else {
//       return Promise.reject(response)
//     }
//   },
//   async (error) => {
//     console.log(error)
//   },
// )

export default axiosInstance
