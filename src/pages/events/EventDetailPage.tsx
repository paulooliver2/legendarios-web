import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, ChevronRight, Square } from 'lucide-react'
import { useEventDetail, useUpdateEventStatus } from '@/features/events/hooks/useEvents'
import { eventStatusLabel, eventStatusColor } from '@/shared/utils/labels'
import { usePermission } from '@/shared/hooks/usePermission'
import type { EventStatus } from '@/shared/types/common.types'
import { ROUTES } from '@/router/routes'

const STATUS_FLOW: EventStatus[] = ['PLANEJAMENTO', 'INSCRICOES_ABERTAS', 'EM_ANDAMENTO', 'FINALIZADO']

function ProgressBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-700 font-semibold">{count}/{total} <span className="text-gray-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading, isError } = useEventDetail(id ?? '')
  const updateStatus = useUpdateEventStatus(id ?? '')
  const { can } = usePermission()
  const canManage = can('create_event')

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !event) {
    return <div className="text-center py-16 text-gray-400">Evento não encontrado.</div>
  }

  const currentIdx = STATUS_FLOW.indexOf(event.status)
  const nextStatus = STATUS_FLOW[currentIdx + 1] as EventStatus | undefined
  const currentRequirements: string[] = event.requirements?.[event.status] ?? []

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.EVENTS.LIST} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detalhes do Evento</h1>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{event.name}</h2>
            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary">
              {event.type}
            </span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${eventStatusColor[event.status]}`}>
            {eventStatusLabel[event.status]}
          </span>
        </div>

        {/* Status progress */}
        <div className="flex items-center gap-1">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-1.5 rounded-full flex-1 ${i <= currentIdx ? 'bg-primary' : 'bg-gray-200'}`} />
              {i < STATUS_FLOW.length - 1 && (
                <ChevronRight size={10} className={i < currentIdx ? 'text-primary' : 'text-gray-300'} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 -mt-1">
          {STATUS_FLOW.map((s) => (
            <span key={s} className={s === event.status ? 'text-primary font-medium' : ''}>
              {eventStatusLabel[s]}
            </span>
          ))}
        </div>

        {/* Info rows */}
        <div className="space-y-2 text-sm pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <Calendar size={15} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">
              {new Date(event.startDate).toLocaleDateString('pt-BR')}
              {event.endDate && ` — ${new Date(event.endDate).toLocaleDateString('pt-BR')}`}
            </span>
          </div>
          {(event.cidade || event.uf) && (
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">
                {[event.cidade, event.uf].filter(Boolean).join(' — ')}
                {event.location && ` · ${event.location}`}
              </span>
            </div>
          )}
          {!event.cidade && !event.uf && event.location && (
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{event.location}</span>
            </div>
          )}
          {event.description && (
            <p className="text-gray-600 leading-relaxed pt-1">{event.description}</p>
          )}
        </div>

        {/* Participant progress bars */}
        {(event.limiteServos || event.limiteParticipantes) && (
          <div className="pt-3 border-t border-gray-50 space-y-3">
            {event.limiteServos && (
              <ProgressBar
                label="Servos"
                count={event.inscritosServos ?? 0}
                total={event.limiteServos}
              />
            )}
            {event.limiteParticipantes && (
              <ProgressBar
                label="Participantes"
                count={event.inscritosParticipantes ?? 0}
                total={event.limiteParticipantes}
              />
            )}
          </div>
        )}

        {/* Requirements checklist for current status */}
        {currentRequirements.length > 0 && (
          <div className="pt-3 border-t border-gray-50 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Requisitos — {eventStatusLabel[event.status]}
            </p>
            <div className="space-y-1.5">
              {currentRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Square size={14} className="text-gray-300 flex-shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avançar status */}
        {canManage && nextStatus && (
          <div className="pt-2 border-t border-gray-50">
            <button
              onClick={() => updateStatus.mutate(nextStatus)}
              disabled={updateStatus.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              <ChevronRight size={15} />
              Avançar para: {eventStatusLabel[nextStatus]}
            </button>
          </div>
        )}
      </div>

      {/* Equipes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Equipes ({event.teams?.length ?? 0})
          </h3>
        </div>
        {!event.teams || event.teams.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma equipe cadastrada.</p>
        ) : (
          <div className="space-y-2">
            {event.teams.map((team) => (
              <div key={team.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium text-gray-700">{team.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
