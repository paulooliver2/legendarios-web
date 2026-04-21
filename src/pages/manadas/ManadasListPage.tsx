import { Link } from 'react-router-dom'
import { Shield, ChevronRight, Users, MapPin } from 'lucide-react'
import { usePistas } from '@/features/manadas/hooks/useManadas'
import { ROUTES } from '@/router/routes'

export function ManadasListPage() {
  const { data: pistas, isLoading, isError } = usePistas()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Pistas</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg text-center">
          Erro ao carregar pistas.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {(pistas ?? []).map((pista) => (
            <Link
              key={pista.id}
              to={ROUTES.PISTAS.DETAIL.replace(':id', pista.id)}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {pista.logoUrl
                    ? <img src={pista.logoUrl} alt={pista.name} className="w-full h-full object-cover" />
                    : <Shield size={18} className="text-primary" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">{pista.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {pista._count && (
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{pista._count.members} membros</span>
                      </div>
                    )}
                    {(pista.cidade || pista.uf) && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {[pista.cidade, pista.uf].filter(Boolean).join(' — ')}
                        </span>
                      </div>
                    )}
                  </div>
                  {pista.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{pista.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
          ))}

          {(pistas ?? []).length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <Shield size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Nenhuma pista encontrada.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
