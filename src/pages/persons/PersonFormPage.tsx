import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PersonForm } from '@/features/persons/components/PersonForm'
import { useCreatePerson, useUpdatePerson, usePersonDetail } from '@/features/persons/hooks/usePersons'
import { ROUTES } from '@/router/routes'

export function PersonFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const { data: person } = usePersonDetail(id ?? '')
  const createMutation = useCreatePerson()
  const updateMutation = useUpdatePerson(id ?? '')

  const mutation = isEditMode ? updateMutation : createMutation
  const error = mutation.error ? 'Erro ao salvar pessoa. Verifique os dados e tente novamente.' : null

  const handleSubmit = (data: { fullName: string; email?: string; phone?: string }) => {
    if (isEditMode) {
      updateMutation.mutate(data, {
        onSuccess: () => navigate(ROUTES.PERSONS.DETAIL.replace(':id', id!)),
      })
    } else {
      createMutation.mutate(
        { ...data, email: data.email || undefined },
        { onSuccess: (newPerson) => navigate(ROUTES.PERSONS.DETAIL.replace(':id', newPerson.id)) },
      )
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PERSONS.LIST} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          {isEditMode ? 'Editar Pessoa' : 'Nova Pessoa'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <PersonForm
          defaultValues={person}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          error={error}
        />
      </div>
    </div>
  )
}
