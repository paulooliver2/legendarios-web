import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuthStore } from '../../store/auth.store'
import { usePermission } from '../usePermission'
import type { AuthUser } from '../../types/common.types'

function setUser(overrides: Partial<AuthUser> = {}) {
  const user: AuthUser = {
    id: 'person-1',
    name: 'Teste',
    systemRole: 'VIEWER',
    journeyStatus: 'PRE_LEGENDARIO',
    ...overrides,
  }
  useAuthStore.getState().setAuth(user, 'token', 'refresh')
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('usePermission', () => {
  describe('isAdmin', () => {
    it('é true somente para ADMIN', () => {
      setUser({ systemRole: 'ADMIN' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isAdmin).toBe(true)
    })

    it('é false para OPERATOR', () => {
      setUser({ systemRole: 'OPERATOR' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isAdmin).toBe(false)
    })
  })

  describe('isOperatorOrAbove', () => {
    it('é true para ADMIN', () => {
      setUser({ systemRole: 'ADMIN' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isOperatorOrAbove).toBe(true)
    })

    it('é true para OPERATOR', () => {
      setUser({ systemRole: 'OPERATOR' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isOperatorOrAbove).toBe(true)
    })

    it('é false para VIEWER', () => {
      setUser({ systemRole: 'VIEWER' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isOperatorOrAbove).toBe(false)
    })
  })

  describe('isLegendario', () => {
    it('é true quando journeyStatus é LEGENDARIO', () => {
      setUser({ journeyStatus: 'LEGENDARIO' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isLegendario).toBe(true)
    })

    it('é false quando journeyStatus é PRE_LEGENDARIO', () => {
      setUser({ journeyStatus: 'PRE_LEGENDARIO' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.isLegendario).toBe(false)
    })
  })

  describe('can()', () => {
    it('ADMIN pode criar eventos', () => {
      setUser({ systemRole: 'ADMIN' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.can('create_event')).toBe(true)
    })

    it('VIEWER não pode criar eventos', () => {
      setUser({ systemRole: 'VIEWER' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.can('create_event')).toBe(false)
    })

    it('ADMIN pode promover jornada', () => {
      setUser({ systemRole: 'ADMIN' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.can('promote_journey')).toBe(true)
    })

    it('OPERATOR não pode promover jornada', () => {
      setUser({ systemRole: 'OPERATOR' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.can('promote_journey')).toBe(false)
    })

    it('TEAM_LEADER pode revisar inscrições', () => {
      setUser({ systemRole: 'TEAM_LEADER' })
      const { result } = renderHook(() => usePermission())
      expect(result.current.can('review_memberships')).toBe(true)
    })
  })

  describe('sem usuário autenticado', () => {
    it('todas as permissões são false', () => {
      const { result } = renderHook(() => usePermission())
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isLegendario).toBe(false)
      expect(result.current.can('create_event')).toBe(false)
    })
  })
})
