import { apiClient } from '@/shared/api/client'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
}
