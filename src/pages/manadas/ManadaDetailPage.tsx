import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, UserPlus, Users, Crown, Plus, ChevronDown } from 'lucide-react'
import {
  usePistaDetail,
  usePistaMembers,
  useAddPistaMember,
  useSetPistaMemberRole,
  useCreatePistaTeam,
} from '@/features/manadas/hooks/useManadas'
import { usePermission } from '@/shared/hooks/usePermission'
import { pistaMemberRoleLabel } from '@/shared/utils/labels'
import type { PistaMemberRole } from '@/shared/types/common.types'
import type { PistaMemberItem, PistaTeam } from '@/features/manadas/types/manada.types'
import { ROUTES } from '@/router/routes'

const roleBadgeColor: Record<PistaMemberRole, string> = {
  LIDER: 'bg-primary-50 text-primary',
  COORDENADOR: 'bg-blue-50 text-blue-700',
  SUB_COORDENADOR: 'bg-purple-50 text-purple-700',
  MEMBRO: 'bg-gray-100 text-gray-500',
}

function MemberRow({
  member,
  canManage,
  teams,
  onSetRole,
}: {
  member: PistaMemberItem
  canManage: boolean
  teams: PistaTeam[]
  onSetRole: (personId: string, role: PistaMemberRole, teamId?: string | null) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {member.person?.photoUrl
            ? <img src={member.person.photoUrl} alt="" className="w-full h-full object-cover" />
            : <span className="text-primary text-xs font-bold">
                {(member.person?.fullName ?? '?').charAt(0).toUpperCase()}
              </span>
          }
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900">
            {member.person?.fullName ?? member.personId}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleBadgeColor[member.memberRole]}`}>
              {pistaMemberRoleLabel[member.memberRole]}
            </span>
            {member.pistaTeam && (
              <span className="text-xs text-gray-400">{member.pistaTeam.name}</span>
            )}
          </div>
        </div>
      </div>

      {canManage && (
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary px-2 py-1 rounded hover:bg-primary-50 transition-colors"
          >
            Alterar <ChevronDown size={12} />
          </button>
          {open && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-max p-1">
              {(['LIDER', 'COORDENADOR', 'SUB_COORDENADOR', 'MEMBRO'] as PistaMemberRole[]).map((role) => (
                <div key={role}>
                  {(role === 'COORDENADOR' || role === 'SUB_COORDENADOR') && teams.length > 0 ? (
                    teams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { onSetRole(member.personId, role, t.id); setOpen(false) }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-primary-50 rounded-lg flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full ${role === 'COORDENADOR' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                        {pistaMemberRoleLabel[role]} — {t.name}
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() => { onSetRole(member.personId, role, null); setOpen(false) }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-primary-50 rounded-lg flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        role === 'LIDER' ? 'bg-primary' : 'bg-gray-400'
                      }`} />
                      {pistaMemberRoleLabel[role]}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ManadaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { can, isAdmin } = usePermission()
  const { data: pista, isLoading } = usePistaDetail(id ?? '')
  const { data: allMembers } = usePistaMembers(id ?? '')
  const addMember = useAddPistaMember(id ?? '')
  const setRole = useSetPistaMemberRole(id ?? '')
  const createTeam = useCreatePistaTeam(id ?? '')
  const [personId, setPersonId] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const canManage = can('add_pista_member')

  if (isLoading || !pista) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const teams = pista.teams ?? []
  const leaders = (allMembers ?? []).filter((m) => m.memberRole === 'LIDER')
  const coordMembers = (allMembers ?? []).filter((m) =>
    m.memberRole === 'COORDENADOR' || m.memberRole === 'SUB_COORDENADOR',
  )
  const handleSetRole = (personId: string, role: PistaMemberRole, teamId?: string | null) => {
    setRole.mutate({ personId, memberRole: role, pistaTeamId: teamId })
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PISTAS.LIST} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{pista.name}</h1>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4">
          {pista.logoUrl && (
            <img src={pista.logoUrl} alt={pista.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="space-y-1 flex-1">
            {pista.description && <p className="text-sm text-gray-600 leading-relaxed">{pista.description}</p>}
            {(pista.cidade || pista.uf) && (
              <p className="text-xs text-gray-400">{[pista.cidade, pista.uf].filter(Boolean).join(' — ')}</p>
            )}
          </div>
        </div>

        {leaders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Líderes</p>
            <div className="flex flex-wrap gap-2">
              {leaders.map((l) => (
                <div key={l.personId} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 rounded-full">
                  <Crown size={12} className="text-primary" />
                  <span className="text-xs font-medium text-primary">{l.person?.fullName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Equipes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Equipes ({teams.length})
          </h3>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Nome da equipe"
                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => { createTeam.mutate(newTeamName); setNewTeamName('') }}
                disabled={!newTeamName.trim() || createTeam.isPending}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                <Plus size={12} /> Criar
              </button>
            </div>
          )}
        </div>

        {teams.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma equipe criada.</p>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => {
              const teamCoords = coordMembers.filter((m) => m.pistaTeamId === team.id)
              return (
                <div key={team.id} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{team.name}</p>
                  {teamCoords.length === 0 ? (
                    <p className="text-xs text-gray-400">Sem coordenadores.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {teamCoords.map((m) => (
                        <div key={m.personId} className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleBadgeColor[m.memberRole]}`}>
                            {pistaMemberRoleLabel[m.memberRole]}
                          </span>
                          <span className="text-xs text-gray-700">{m.person?.fullName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Todos os membros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Membros ({(allMembers ?? []).length})
          </h3>
        </div>

        {(allMembers ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum membro nesta pista.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {(allMembers ?? []).map((m) => (
              <MemberRow
                key={m.personId}
                member={m}
                canManage={canManage}
                teams={teams}
                onSetRole={handleSetRole}
              />
            ))}
          </div>
        )}

        {canManage && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
            <input
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              placeholder="ID da pessoa"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <button
              onClick={() => { addMember.mutate({ personId }); setPersonId('') }}
              disabled={!personId.trim() || addMember.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              <UserPlus size={15} />
              <span>Adicionar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
