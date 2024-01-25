import axios from 'axios'

import { JAVA_GATEWAY_URL } from './constants'
import { getAuthorizationHeader } from './functions'

export const api = axios.create({
  baseURL: JAVA_GATEWAY_URL,
})

api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = getAuthorizationHeader()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
