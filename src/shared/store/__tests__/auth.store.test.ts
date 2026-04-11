import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../auth.store'
import type { AuthUser } from '../../types/common.types'

const mockUser: AuthUser = {
  id: 'person-uuid-1',
  name: 'João Legendário',
  systemRole: 'ADMIN',
  journeyStatus: 'LEGENDARIO',
}

beforeEach(() => {
  // Reseta o store entre os testes para isolamento
  useAuthStore.getState().clearAuth()
})

describe('useAuthStore', () => {
  describe('estado inicial', () => {
    it('começa desautenticado', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
    })
  })

  describe('setAuth()', () => {
    it('armazena usuário e tokens e marca como autenticado', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-abc', 'refresh-xyz')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockUser)
      expect(state.accessToken).toBe('access-abc')
      expect(state.refreshToken).toBe('refresh-xyz')
    })

    it('atualiza o usuário se chamado novamente', () => {
      const outroUser: AuthUser = { ...mockUser, name: 'Outro Usuário', systemRole: 'VIEWER' }
      useAuthStore.getState().setAuth(mockUser, 'token-1', 'refresh-1')
      useAuthStore.getState().setAuth(outroUser, 'token-2', 'refresh-2')

      expect(useAuthStore.getState().user?.name).toBe('Outro Usuário')
      expect(useAuthStore.getState().accessToken).toBe('token-2')
    })
  })

  describe('setTokens()', () => {
    it('atualiza apenas os tokens sem alterar o usuário', () => {
      useAuthStore.getState().setAuth(mockUser, 'access-old', 'refresh-old')
      useAuthStore.getState().setTokens('access-new', 'refresh-new')

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.accessToken).toBe('access-new')
      expect(state.refreshToken).toBe('refresh-new')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('clearAuth()', () => {
    it('limpa todos os dados de autenticação', () => {
      useAuthStore.getState().setAuth(mockUser, 'access', 'refresh')
      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
    })

    it('pode ser chamado em estado já limpo sem erros', () => {
      expect(() => useAuthStore.getState().clearAuth()).not.toThrow()
    })
  })
})
