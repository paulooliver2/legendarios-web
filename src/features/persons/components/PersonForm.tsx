import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Person } from '../types/person.types'

const personSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
})

type PersonFormData = z.infer<typeof personSchema>

interface Props {
  defaultValues?: Partial<Person>
  onSubmit: (data: PersonFormData) => void
  isLoading?: boolean
  error?: string | null
}

export function PersonForm({ defaultValues, onSubmit, isLoading, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <div>
        <label>Nome completo *</label>
        <input {...register('fullName')} />
        {errors.fullName && <span style={{ color: 'red' }}>{errors.fullName.message}</span>}
      </div>

      <div>
        <label>E-mail</label>
        <input {...register('email')} type="email" />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
      </div>

      <div>
        <label>Telefone</label>
        <input {...register('phone')} />
      </div>

      {error && <span style={{ color: 'red' }}>{error}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
