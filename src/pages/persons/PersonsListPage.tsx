import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePersons } from '@/features/persons/hooks/usePersons'
import { PersonJourneyBadge } from '@/features/persons/components/PersonJourneyBadge'
import { usePermission } from '@/shared/hooks/usePermission'
import { ROUTES } from '@/router/routes'

export function PersonsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { can } = usePermission()
  const { data, isLoading, isError } = usePersons({ page, limit: 20 })

  const persons = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Pessoas</h1>
        {can('create_person') && (
          <Link
            to={ROUTES.PERSONS.CREATE}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nova Pessoa</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg text-center">
          Erro ao carregar pessoas.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Jornada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {persons
                  .filter((p) => p.fullName.toLowerCase().includes(search.toLowerCase()))
                  .map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          to={ROUTES.PERSONS.DETAIL.replace(':id', person.id)}
                          className="flex items-center gap-3 hover:text-primary transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {person.photoUrl
                              ? <img src={person.photoUrl} alt={person.fullName} className="w-full h-full object-cover" />
                              : <span className="text-primary text-xs font-bold">{person.fullName.charAt(0).toUpperCase()}</span>
                            }
                          </div>
                          <span className="font-medium text-gray-900">{person.fullName}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{person.email ?? '—'}</td>
                      <td className="px-4 py-3">
                        <PersonJourneyBadge status={person.journeyStatus} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {persons.length === 0 && (
              <p className="text-center text-gray-400 py-12 text-sm">Nenhuma pessoa encontrada.</p>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {persons
              .filter((p) => p.fullName.toLowerCase().includes(search.toLowerCase()))
              .map((person) => (
                <Link
                  key={person.id}
                  to={ROUTES.PERSONS.DETAIL.replace(':id', person.id)}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{person.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{person.email ?? 'Sem e-mail'}</p>
                    </div>
                    <PersonJourneyBadge status={person.journeyStatus} />
                  </div>
                </Link>
              ))}
            {persons.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">Nenhuma pessoa encontrada.</p>
            )}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                Página {meta.page} de {meta.totalPages} ({meta.total} pessoas)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
