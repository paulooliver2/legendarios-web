import type { PistaMemberRole } from '@/shared/types/common.types'

export interface PistaTeam {
  id: string
  pistaId: string
  name: string
  createdAt: string
  members?: PistaMemberItem[]
}

export interface PistaMemberItem {
  personId: string
  pistaId: string
  memberRole: PistaMemberRole
  pistaTeamId?: string | null
  joinedAt: string
  person?: { id: string; fullName: string; photoUrl?: string }
  pistaTeam?: { id: string; name: string } | null
}

export interface Pista {
  id: string
  name: string
  description?: string
  logoUrl?: string
  uf?: string
  cidade?: string
  createdAt: string
  _count?: { members: number }
  members?: PistaMemberItem[]
  teams?: PistaTeam[]
}
