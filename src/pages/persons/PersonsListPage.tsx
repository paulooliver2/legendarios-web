import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePersons } from '@/features/persons/hooks/usePersons'
import { PersonJourneyBadge } from '@/features/persons/components/PersonJourneyBadge'
import { ROUTES } from '@/router/routes'

export function PersonsListPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = usePersons({ page, limit: 20 })

  if (isLoading) return <div>Carregando...</div>
  if (isError) return <div>Erro ao carregar pessoas.</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Pessoas</h1>
        <Link to={ROUTES.PERSONS.CREATE}>
          <button>Nova Pessoa</button>
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Jornada</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((person) => (
            <tr key={person.id}>
              <td>
                <Link to={ROUTES.PERSONS.DETAIL.replace(':id', person.id)}>{person.fullName}</Link>
              </td>
              <td>{person.email ?? '—'}</td>
              <td><PersonJourneyBadge status={person.journeyStatus} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && (
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </button>
          <span>Página {data.meta.page} de {data.meta.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.meta.totalPages}>
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
