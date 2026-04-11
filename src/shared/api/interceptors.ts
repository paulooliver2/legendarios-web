import type { AxiosInstance } from 'axios'
import { useAuthStore } from '../store/auth.store'

export function setupInterceptors(client: AxiosInstance) {
  // Injeta access token em cada request
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Trata 401: tenta refresh e reenvia a request original
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = useAuthStore.getState().refreshToken

        if (!refreshToken) {
          useAuthStore.getState().clearAuth()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        try {
          const { data } = await client.post('/auth/refresh', { refreshToken })
          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return client(originalRequest)
        } catch {
          useAuthStore.getState().clearAuth()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    },
  )
}
