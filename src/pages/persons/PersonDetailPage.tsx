import { useParams } from 'react-router-dom'
import { usePersonDetail } from '@/features/persons/hooks/usePersons'
import { PersonJourneyBadge } from '@/features/persons/components/PersonJourneyBadge'

interface ManadaMemberData {
  manada: { id: string; name: string }
}

interface PersonWithManadas {
  id: string
  fullName: string
  email?: string | null
  phone?: string | null
  journeyStatus: 'PRE_LEGENDARIO' | 'LEGENDARIO'
  journeyChangedAt?: string | null
  manadaMembers?: ManadaMemberData[]
}

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = usePersonDetail(id ?? '')
  const person = data as PersonWithManadas | undefined

  if (isLoading) return <div>Carregando...</div>
  if (isError || !person) return <div>Pessoa não encontrada.</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1>{person.fullName}</h1>
        <PersonJourneyBadge status={person.journeyStatus} />
      </div>

      <section>
        <h2>Informações</h2>
        <p><strong>E-mail:</strong> {person.email ?? '—'}</p>
        <p><strong>Telefone:</strong> {person.phone ?? '—'}</p>
        {person.journeyChangedAt && (
          <p><strong>Jornada atualizada em:</strong> {new Date(person.journeyChangedAt).toLocaleDateString('pt-BR')}</p>
        )}
      </section>

      {person.manadaMembers && (
        <section>
          <h2>Manadas</h2>
          {person.manadaMembers.length === 0
            ? <p>Sem manadas.</p>
            : person.manadaMembers.map((m) => (
                <span key={m.manada.id} style={{ marginRight: 8 }}>{m.manada.name}</span>
              ))
          }
        </section>
      )}
    </div>
  )
}
