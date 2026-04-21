import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Church, Users, Heart, Edit, Hash, CheckCircle, XCircle } from 'lucide-react'
import { usePersonDetail } from '@/features/persons/hooks/usePersons'
import { PersonJourneyBadge } from '@/features/persons/components/PersonJourneyBadge'
import type { Person } from '@/features/persons/types/person.types'
import { ROUTES } from '@/router/routes'

interface PersonWithPistas extends Person {
  pistaMembers?: { pista: { id: string; name: string } }[]
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <span className="text-gray-500 text-xs">{label}</span>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  )
}

function BoolRow({ label, value }: { label: string; value?: boolean }) {
  if (value === undefined || value === null) return null
  return (
    <div className="flex items-center gap-2 text-sm">
      {value
        ? <CheckCircle size={15} className="text-green-500" />
        : <XCircle size={15} className="text-gray-300" />}
      <span className={value ? 'text-gray-800' : 'text-gray-400'}>{label}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = usePersonDetail(id ?? '')
  const person = data as PersonWithPistas | undefined

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !person) {
    return <div className="text-center py-16 text-gray-400">Pessoa não encontrada.</div>
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PERSONS.LIST} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detalhes da Pessoa</h1>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {person.photoUrl
                ? <img src={person.photoUrl} alt={person.fullName} className="w-full h-full object-cover" />
                : <span className="text-primary font-bold text-xl">{person.fullName.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{person.fullName}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <PersonJourneyBadge status={person.journeyStatus} />
                {person.numeroLegendario && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary">
                    <Hash size={11} />
                    {person.numeroLegendario}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            to={ROUTES.PERSONS.CREATE.replace('new', `${id}/edit`)}
            className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition-colors flex-shrink-0"
          >
            <Edit size={18} />
          </Link>
        </div>
      </div>

      {/* Contato */}
      <Section title="Contato">
        <InfoRow icon={Mail} label="E-mail" value={person.email} />
        <InfoRow icon={Phone} label="Telefone" value={person.phone} />
        {!person.email && !person.phone && (
          <p className="text-sm text-gray-400">Sem informações de contato.</p>
        )}
      </Section>

      {/* Endereço */}
      {(person.cidade || person.uf || person.cep) && (
        <Section title="Endereço">
          <InfoRow
            icon={MapPin}
            label="Localização"
            value={[person.cidade, person.uf].filter(Boolean).join(' — ')}
          />
          <InfoRow icon={MapPin} label="CEP" value={person.cep} />
        </Section>
      )}

      {/* Igreja e Liderança */}
      {(person.igreja || person.nomeLider || person.numeroLider) && (
        <Section title="Igreja e liderança">
          <InfoRow icon={Church} label="Igreja" value={person.igreja} />
          <InfoRow icon={Users} label="Líder" value={person.nomeLider} />
          <InfoRow icon={Phone} label="Telefone do líder" value={person.numeroLider} />
        </Section>
      )}

      {/* Família */}
      {(person.nomeEsposa || person.nomeMae || person.numeroParente) && (
        <Section title="Família">
          <InfoRow icon={Heart} label="Esposa" value={person.nomeEsposa} />
          <InfoRow icon={Heart} label="Mãe" value={person.nomeMae} />
          <InfoRow icon={Phone} label="Número de parente" value={person.numeroParente} />
        </Section>
      )}

      {/* Flags */}
      <Section title="Informações adicionais">
        <BoolRow label="Já serviu" value={person.jaServiu} />
        <BoolRow label="Possui certificado" value={person.certificado} />
        <BoolRow label="Problema de saúde" value={person.problemaDeSaude} />
        {person.cpf && (
          <div className="flex items-center gap-2 text-sm pt-1 border-t border-gray-50">
            <span className="text-gray-500">CPF:</span>
            <span className="text-gray-700 font-medium">{person.cpf}</span>
          </div>
        )}
      </Section>

      {/* Pistas */}
      {person.pistaMembers && person.pistaMembers.length > 0 && (
        <Section title="Pistas">
          <div className="flex flex-wrap gap-2">
            {person.pistaMembers.map((m) => (
              <Link
                key={m.pista.id}
                to={ROUTES.PISTAS.DETAIL.replace(':id', m.pista.id)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-50 text-primary text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                {m.pista.name}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
