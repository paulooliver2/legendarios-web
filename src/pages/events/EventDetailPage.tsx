import { useParams } from 'react-router-dom'
import { useEventDetail } from '@/features/events/hooks/useEvents'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading, isError } = useEventDetail(id ?? '')

  if (isLoading) return <div>Carregando...</div>
  if (isError || !event) return <div>Evento não encontrado.</div>

  return (
    <div>
      <h1>{event.name}</h1>
      <p><strong>Tipo:</strong> {event.type}</p>
      <p><strong>Data:</strong> {new Date(event.startDate).toLocaleDateString('pt-BR')}</p>
      <p><strong>Status:</strong> {event.isPublished ? 'Publicado' : 'Rascunho'}</p>
      {event.description && <p><strong>Descrição:</strong> {event.description}</p>}

      <section>
        <h2>Equipes</h2>
        {event.teams.length === 0
          ? <p>Nenhuma equipe cadastrada.</p>
          : (
            <ul>
              {event.teams.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          )
        }
      </section>
    </div>
  )
}
