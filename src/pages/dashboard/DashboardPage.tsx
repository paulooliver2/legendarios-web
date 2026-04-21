import { Link } from 'react-router-dom'
import { Users, Calendar, Shield, ClipboardList, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/shared/store/auth.store'
import { usePersons } from '@/features/persons/hooks/usePersons'
import { useEvents } from '@/features/events/hooks/useEvents'
import { usePistas } from '@/features/manadas/hooks/useManadas'
import { useMemberships } from '@/features/memberships/hooks/useMemberships'
import { ROUTES } from '@/router/routes'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: persons } = usePersons({ limit: 1 })
  const { data: events } = useEvents({ limit: 1 })
  const { data: pistas } = usePistas()
  const { data: memberships } = useMemberships({ status: 'EM_ANALISE' })

  const cards = [
    {
      label: 'Pessoas',
      value: persons?.meta.total ?? '—',
      icon: Users,
      to: ROUTES.PERSONS.LIST,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Eventos',
      value: events?.meta.total ?? '—',
      icon: Calendar,
      to: ROUTES.EVENTS.LIST,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Pistas',
      value: pistas?.length ?? '—',
      icon: Shield,
      to: ROUTES.PISTAS.LIST,
      color: 'bg-orange-50 text-primary',
    },
    {
      label: 'Em análise',
      value: memberships?.length ?? '—',
      icon: ClipboardList,
      to: ROUTES.MEMBERSHIPS.LIST,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo ao painel Legendários</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{String(value)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuickLink to={ROUTES.PERSONS.CREATE} icon={Users} label="Cadastrar pessoa" />
        <QuickLink to={ROUTES.EVENTS.CREATE} icon={Calendar} label="Criar evento" />
        <QuickLink to={ROUTES.MEMBERSHIPS.LIST} icon={ClipboardList} label="Revisar inscrições" />
        <QuickLink to={ROUTES.PISTAS.LIST} icon={Shield} label="Ver pistas" />
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
    </Link>
  )
}
