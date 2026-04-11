import { Link } from 'react-router-dom'
import { useManadas } from '@/features/manadas/hooks/useManadas'
import { ROUTES } from '@/router/routes'

export function ManadasListPage() {
  const { data: manadas, isLoading } = useManadas()
  if (isLoading) return <div>Carregando...</div>
  return (
    <div>
      <h1>Manadas</h1>
      <ul>
        {(manadas ?? []).map((m) => (
          <li key={m.id}>
            <Link to={ROUTES.MANADAS.DETAIL.replace(':id', m.id)}>{m.name}</Link>
            {m._count && <span style={{ marginLeft: 8, color: '#666' }}>({m._count.members} membros)</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
