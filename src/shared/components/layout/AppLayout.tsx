import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { Home, Users, Calendar, Shield, ClipboardList, LogOut, Menu, X, Star } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/shared/store/auth.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { personRoleLabel } from '@/shared/utils/labels'
import type { SystemRole, JourneyStatus } from '@/shared/types/common.types'
import { ROUTES } from '@/router/routes'
import logo from '@/shared/imgs/logo-legendarios.jpg'

const navItems = [
  { to: ROUTES.DASHBOARD, icon: Home, label: 'Início' },
  { to: ROUTES.PERSONS.LIST, icon: Users, label: 'Pessoas' },
  { to: ROUTES.EVENTS.TOP, icon: Star, label: 'TOP' },
  { to: ROUTES.EVENTS.LIST, icon: Calendar, label: 'Eventos' },
  { to: ROUTES.PISTAS.LIST, icon: Shield, label: 'Pistas' },
  { to: ROUTES.MEMBERSHIPS.LIST, icon: ClipboardList, label: 'Inscrições' },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 z-30 flex flex-col transform transition-transform duration-200
          lg:static lg:translate-x-0 lg:flex lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Legendários" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-white font-bold text-lg">Legendários</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Link to={ROUTES.PROFILE} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 flex-1 min-w-0 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:ring-2 group-hover:ring-primary-light transition">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate group-hover:text-primary-light transition">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">
                  {user ? personRoleLabel(user.systemRole as SystemRole, user.journeyStatus as JourneyStatus) : ''}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:overflow-y-auto">
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Legendários" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-gray-900">Legendários</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
