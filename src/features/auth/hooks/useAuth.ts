import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/shared/store/auth.store'
import type { AuthUser } from '@/shared/types/common.types'

function toAuthUser(data: { user: { id: string; name: string; systemRole: string; journeyStatus: string } }, setAuth: (u: AuthUser, at: string, rt: string) => void, at: string, rt: string) {
  const authUser: AuthUser = {
    id: data.user.id,
    name: data.user.name,
    systemRole: data.user.systemRole as AuthUser['systemRole'],
    journeyStatus: data.user.journeyStatus as AuthUser['journeyStatus'],
  }
  setAuth(authUser, at, rt)
}

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      toAuthUser(data, setAuth, data.accessToken, data.refreshToken)
      navigate('/')
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      toAuthUser(data, setAuth, data.accessToken, data.refreshToken)
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
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
