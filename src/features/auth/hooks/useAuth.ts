import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/shared/store/auth.store'
import type { AuthUser } from '@/shared/types/common.types'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      const authUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        systemRole: data.user.systemRole as AuthUser['systemRole'],
        journeyStatus: data.user.journeyStatus as AuthUser['journeyStatus'],
      }
      setAuth(authUser, data.accessToken, data.refreshToken)
      navigate('/')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = useAuthStore.getState().refreshToken ?? ''
      return authApi.logout(refreshToken)
    },
    onSettled: () => {
      clearAuth()
      navigate('/login')
    },
  })

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  }
}
