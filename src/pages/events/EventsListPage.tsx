import { Link } from 'react-router-dom'
import { Plus, Calendar } from 'lucide-react'
import { useEvents } from '@/features/events/hooks/useEvents'
import { usePermission } from '@/shared/hooks/usePermission'
import { eventStatusLabel, eventStatusColor } from '@/shared/utils/labels'
import { ROUTES } from '@/router/routes'

const typeLabel: Record<string, string> = { TOP: 'TOP', RPM: 'RPM', OUTRO: 'Outro' }
const typeColor: Record<string, string> = {
  TOP: 'bg-primary-50 text-primary',
  RPM: 'bg-purple-50 text-purple-700',
  OUTRO: 'bg-gray-100 text-gray-600',
}

export function EventsListPage() {
  const { can } = usePermission()
  const { data, isLoading, isError } = useEvents()
  const events = data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Todos os Eventos</h1>
        {can('create_event') && (
          <Link
            to={ROUTES.EVENTS.CREATE}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo Evento</span>
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg text-center">
          Erro ao carregar eventos.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        to={ROUTES.EVENTS.DETAIL.replace(':id', event.id)}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {event.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColor[event.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {typeLabel[event.type] ?? event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(event.startDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${eventStatusColor[event.status]}`}>
                        {eventStatusLabel[event.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && (
              <p className="text-center text-gray-400 py-12 text-sm">Nenhum evento encontrado.</p>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-2">
            {events.map((event) => (
              <Link
                key={event.id}
                to={ROUTES.EVENTS.DETAIL.replace(':id', event.id)}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor[event.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {typeLabel[event.type] ?? event.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${eventStatusColor[event.status]}`}>
                      {eventStatusLabel[event.status]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {events.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">Nenhum evento encontrado.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
