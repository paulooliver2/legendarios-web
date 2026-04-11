import { Link } from 'react-router-dom'
import { useEvents } from '@/features/events/hooks/useEvents'
import { usePermission } from '@/shared/hooks/usePermission'
import { ROUTES } from '@/router/routes'

export function EventsListPage() {
  const { data, isLoading, isError } = useEvents()
  const { can } = usePermission()

  if (isLoading) return <div>Carregando...</div>
  if (isError) return <div>Erro ao carregar eventos.</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Eventos</h1>
        {can('create_event') && (
          <Link to={ROUTES.EVENTS.CREATE}><button>Novo Evento</button></Link>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((event) => (
            <tr key={event.id}>
              <td><Link to={ROUTES.EVENTS.DETAIL.replace(':id', event.id)}>{event.name}</Link></td>
              <td>{event.type}</td>
              <td>{new Date(event.startDate).toLocaleDateString('pt-BR')}</td>
              <td>{event.isPublished ? 'Publicado' : 'Rascunho'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
