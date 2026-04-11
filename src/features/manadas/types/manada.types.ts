export interface Manada {
  id: string
  name: string
  description?: string
  createdAt: string
  _count?: { members: number }
}

export interface ManadaMember {
  personId: string
  manadaId: string
  joinedAt: string
  person?: { id: string; fullName: string }
}
