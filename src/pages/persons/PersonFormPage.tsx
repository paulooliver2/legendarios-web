import { useNavigate, useParams } from 'react-router-dom'
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
  const error = mutation.error
    ? 'Erro ao salvar pessoa. Verifique os dados e tente novamente.'
    : null

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
    <div>
      <h1>{isEditMode ? 'Editar Pessoa' : 'Nova Pessoa'}</h1>
      <PersonForm
        defaultValues={person}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
        error={error}
      />
    </div>
  )
}
