import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateEvent } from '@/features/events/hooks/useEvents'
import { ROUTES } from '@/router/routes'

const eventSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  type: z.enum(['TOP', 'RPM', 'OUTRO']),
  startDate: z.string().min(1, 'Data é obrigatória'),
  description: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

export function EventCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateEvent()

  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })

  const onSubmit = (data: EventFormData) => {
    createMutation.mutate(
      { ...data, startDate: new Date(data.startDate).toISOString() },
      { onSuccess: (event) => navigate(ROUTES.EVENTS.DETAIL.replace(':id', event.id)) },
    )
  }

  return (
    <div>
      <h1>Novo Evento</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
        <div>
          <label>Nome *</label>
          <input {...register('name')} />
          {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
        </div>

        <div>
          <label>Tipo *</label>
          <select {...register('type')}>
            <option value="TOP">TOP</option>
            <option value="RPM">RPM</option>
            <option value="OUTRO">Outro</option>
          </select>
          {errors.type && <span style={{ color: 'red' }}>{errors.type.message}</span>}
        </div>

        <div>
          <label>Data de início *</label>
          <input type="date" {...register('startDate')} />
          {errors.startDate && <span style={{ color: 'red' }}>{errors.startDate.message}</span>}
        </div>

        <div>
          <label>Descrição</label>
          <textarea {...register('description')} />
        </div>

        {createMutation.error && <span style={{ color: 'red' }}>Erro ao criar evento.</span>}

        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Criando...' : 'Criar Evento'}
        </button>
      </form>
    </div>
  )
}
