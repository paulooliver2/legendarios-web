import type { JourneyStatus } from '@/shared/types/common.types'

export interface Person {
  id: string
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
  journeyStatus: JourneyStatus
  journeyChangedAt?: string
  createdAt: string
}

export interface CreatePersonRequest {
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
}
