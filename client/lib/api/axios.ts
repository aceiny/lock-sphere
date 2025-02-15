import axios from "axios"

export interface ResponseInterface<T> {
  message : string,
  stats : number,
  data : T
}
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status: number) => status === 200 || status === 201,
  withCredentials:true
}) 

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default api

