import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/router/routes'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Legendários</h1>
        <div>
          <span style={{ marginRight: 16 }}>{user?.name}</span>
          <button onClick={() => logout()}>Sair</button>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <Link to={ROUTES.PERSONS.LIST}>Pessoas</Link>
        <Link to={ROUTES.EVENTS.LIST}>Eventos</Link>
        <Link to={ROUTES.MEMBERSHIPS.LIST}>Inscrições</Link>
        <Link to={ROUTES.MANADAS.LIST}>Manadas</Link>
      </nav>
    </div>
  )
}
