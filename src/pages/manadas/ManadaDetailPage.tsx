import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useManadaDetail, useManadaMembers, useAddManadaMember } from '@/features/manadas/hooks/useManadas'

export function ManadaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: manada, isLoading } = useManadaDetail(id ?? '')
  const { data: members } = useManadaMembers(id ?? '')
  const addMember = useAddManadaMember(id ?? '')
  const [personId, setPersonId] = useState('')

  if (isLoading || !manada) return <div>Carregando...</div>

  return (
    <div>
      <h1>{manada.name}</h1>
      {manada.description && <p>{manada.description}</p>}

      <section>
        <h2>Membros</h2>
        <ul>
          {(members ?? []).map((m) => (
            <li key={m.personId}>{m.person?.fullName ?? m.personId}</li>
          ))}
        </ul>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input value={personId} onChange={(e) => setPersonId(e.target.value)} placeholder="ID da pessoa" />
          <button onClick={() => { addMember.mutate(personId); setPersonId('') }} disabled={!personId || addMember.isPending}>
            Adicionar
          </button>
        </div>
      </section>
    </div>
  )
}
