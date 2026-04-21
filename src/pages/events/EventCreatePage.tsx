import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { useCreateEvent } from '@/features/events/hooks/useEvents'
import { ROUTES } from '@/router/routes'
import { BRAZIL_STATES } from '@/shared/constants/brazil-states'
import type { EventStatus } from '@/shared/types/common.types'

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  type: z.enum(['TOP', 'RPM', 'OUTRO']),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  uf: z.string().optional(),
  cidade: z.string().optional(),
  limiteServos: z.coerce.number().int().positive().optional().or(z.literal('')),
  limiteParticipantes: z.coerce.number().int().positive().optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

type RequirementsMap = Partial<Record<EventStatus, string[]>>

const TOP_DEFAULTS: RequirementsMap = {
  PLANEJAMENTO: ['Documentação completa', 'Aprovação médica'],
  INSCRICOES_ABERTAS: ['Questionário preenchido', 'Pagamento confirmado'],
  EM_ANDAMENTO: ['Check-in realizado', 'Material recebido'],
}

const REQUIREMENT_STATUSES: { key: EventStatus; label: string }[] = [
  { key: 'PLANEJAMENTO', label: 'Planejamento' },
  { key: 'INSCRICOES_ABERTAS', label: 'Inscrições Abertas' },
  { key: 'EM_ANDAMENTO', label: 'Em Andamento' },
]

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

export function EventCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateEvent()
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'TOP' },
  })

  const eventType = useWatch({ control, name: 'type' })
  const [requirements, setRequirements] = useState<RequirementsMap>(TOP_DEFAULTS)
  const [newItem, setNewItem] = useState<Partial<Record<EventStatus, string>>>({})

  useEffect(() => {
    setRequirements(eventType === 'TOP' ? { ...TOP_DEFAULTS } : {})
  }, [eventType])

  const addItem = (status: EventStatus) => {
    const text = newItem[status]?.trim()
    if (!text) return
    setRequirements((prev) => ({
      ...prev,
      [status]: [...(prev[status] ?? []), text],
    }))
    setNewItem((prev) => ({ ...prev, [status]: '' }))
  }

  const removeItem = (status: EventStatus, idx: number) => {
    setRequirements((prev) => ({
      ...prev,
      [status]: (prev[status] ?? []).filter((_, i) => i !== idx),
    }))
  }

  const onSubmit = (data: FormData) => {
    const reqs: Record<string, string[]> = {}
    for (const { key } of REQUIREMENT_STATUSES) {
      if (requirements[key]?.length) reqs[key] = requirements[key]!
    }

    createMutation.mutate(
      {
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        description: data.description || undefined,
        location: data.location || undefined,
        uf: data.uf || undefined,
        cidade: data.cidade || undefined,
        limiteServos: data.limiteServos ? Number(data.limiteServos) : undefined,
        limiteParticipantes: data.limiteParticipantes ? Number(data.limiteParticipantes) : undefined,
        requirements: Object.keys(reqs).length ? reqs : undefined,
      },
      { onSuccess: (event) => navigate(ROUTES.EVENTS.DETAIL.replace(':id', event.id)) },
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.EVENTS.LIST} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Novo Evento</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nome *</label>
              <input {...register('name')} className={inputCls} placeholder="Nome do evento" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Tipo *</label>
              <select {...register('type')} className={inputCls}>
                <option value="TOP">TOP</option>
                <option value="RPM">RPM</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Local (nome do lugar)</label>
              <input {...register('location')} className={inputCls} placeholder="Ex: Salão paroquial" />
            </div>

            <div>
              <label className={labelCls}>Estado (UF)</label>
              <select {...register('uf')} className={inputCls}>
                <option value="">Selecione</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>{s.uf} — {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Cidade</label>
              <input {...register('cidade')} className={inputCls} placeholder="Ex: São Paulo" />
            </div>

            <div>
              <label className={labelCls}>Data de início *</label>
              <input type="date" {...register('startDate')} className={inputCls} />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Data de fim</label>
              <input type="date" {...register('endDate')} className={inputCls} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Limites de vagas</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Servos</label>
                <input type="number" min={1} {...register('limiteServos')} className={inputCls} placeholder="Ex: 30" />
              </div>
              <div>
                <label className={labelCls}>Participantes</label>
                <input type="number" min={1} {...register('limiteParticipantes')} className={inputCls} placeholder="Ex: 50" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              {...register('description')}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Descrição opcional..."
            />
          </div>

          {/* Requirements */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Requisitos por status
            </p>
            {REQUIREMENT_STATUSES.map(({ key, label }) => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
                <div className="space-y-1.5 mb-2">
                  {(requirements[key] ?? []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <span className="flex-1">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(key, idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem[key] ?? ''}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(key))}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Novo requisito..."
                  />
                  <button
                    type="button"
                    onClick={() => addItem(key)}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {createMutation.error && (
            <p className="text-red-500 text-sm">Erro ao criar evento. Tente novamente.</p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {createMutation.isPending ? 'Criando...' : 'Criar Evento'}
          </button>
        </form>
      </div>
    </div>
  )
}
