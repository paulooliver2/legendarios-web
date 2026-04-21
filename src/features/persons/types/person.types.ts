import type { JourneyStatus } from '@/shared/types/common.types'

export interface Person {
  id: string
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
  journeyStatus: JourneyStatus
  journeyChangedAt?: string

  numeroLegendario?: string
  cpf?: string
  uf?: string
  cidade?: string
  cep?: string
  jaServiu?: boolean
  certificado?: boolean
  problemaDeSaude?: boolean
  igreja?: string
  nomeLider?: string
  numeroLider?: string
  nomeEsposa?: string
  nomeMae?: string
  numeroParente?: string
  photoUrl?: string

  createdAt: string
}

export interface CreatePersonRequest {
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
  numeroLegendario?: string
  cpf?: string
  uf?: string
  cidade?: string
  cep?: string
  jaServiu?: boolean
  certificado?: boolean
  problemaDeSaude?: boolean
  igreja?: string
  nomeLider?: string
  numeroLider?: string
  nomeEsposa?: string
  nomeMae?: string
  numeroParente?: string
  photoUrl?: string
}
