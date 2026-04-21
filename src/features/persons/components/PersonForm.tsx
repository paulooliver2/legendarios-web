import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Person } from '../types/person.types'

const schema = z.object({
  fullName: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  numeroLegendario: z.string().optional(),
  cpf: z.string().optional(),
  uf: z.string().max(2, 'Máx. 2 caracteres').optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  jaServiu: z.boolean().optional(),
  certificado: z.boolean().optional(),
  problemaDeSaude: z.boolean().optional(),
  igreja: z.string().optional(),
  nomeLider: z.string().optional(),
  numeroLider: z.string().optional(),
  nomeEsposa: z.string().optional(),
  nomeMae: z.string().optional(),
  numeroParente: z.string().optional(),
  photoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<Person>
  onSubmit: (data: FormData) => void
  isLoading?: boolean
  error?: string | null
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function CheckField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-gray-300 text-primary accent-primary"
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2 pb-1 border-b border-gray-100">
      {children}
    </h3>
  )
}

export function PersonForm({ defaultValues, onSubmit, isLoading, error }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      numeroLegendario: defaultValues?.numeroLegendario ?? '',
      cpf: defaultValues?.cpf ?? '',
      uf: defaultValues?.uf ?? '',
      cidade: defaultValues?.cidade ?? '',
      cep: defaultValues?.cep ?? '',
      jaServiu: defaultValues?.jaServiu ?? false,
      certificado: defaultValues?.certificado ?? false,
      problemaDeSaude: defaultValues?.problemaDeSaude ?? false,
      igreja: defaultValues?.igreja ?? '',
      nomeLider: defaultValues?.nomeLider ?? '',
      numeroLider: defaultValues?.numeroLider ?? '',
      nomeEsposa: defaultValues?.nomeEsposa ?? '',
      nomeMae: defaultValues?.nomeMae ?? '',
      numeroParente: defaultValues?.numeroParente ?? '',
      photoUrl: defaultValues?.photoUrl ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SectionTitle>Dados principais</SectionTitle>

      <Field label="Foto (URL)" error={errors.photoUrl?.message}>
        <input {...register('photoUrl')} className={inputCls} placeholder="https://..." />
      </Field>

      <Field label="Nome completo *" error={errors.fullName?.message}>
        <input {...register('fullName')} className={inputCls} placeholder="Nome completo" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="E-mail" error={errors.email?.message}>
          <input {...register('email')} type="email" className={inputCls} placeholder="email@exemplo.com" />
        </Field>
        <Field label="Telefone">
          <input {...register('phone')} className={inputCls} placeholder="(00) 00000-0000" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Número Legendário">
          <input {...register('numeroLegendario')} className={inputCls} placeholder="Ex: 1234" />
        </Field>
        <Field label="CPF">
          <input {...register('cpf')} className={inputCls} placeholder="000.000.000-00" />
        </Field>
      </div>

      <SectionTitle>Endereço</SectionTitle>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2">
          <Field label="Cidade">
            <input {...register('cidade')} className={inputCls} placeholder="Cidade" />
          </Field>
        </div>
        <Field label="UF" error={errors.uf?.message}>
          <input {...register('uf')} className={inputCls} placeholder="SP" maxLength={2} />
        </Field>
        <Field label="CEP">
          <input {...register('cep')} className={inputCls} placeholder="00000-000" />
        </Field>
      </div>

      <SectionTitle>Igreja e liderança</SectionTitle>

      <Field label="Igreja">
        <input {...register('igreja')} className={inputCls} placeholder="Nome da igreja" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome do líder">
          <input {...register('nomeLider')} className={inputCls} placeholder="Nome do líder" />
        </Field>
        <Field label="Número do líder">
          <input {...register('numeroLider')} className={inputCls} placeholder="(00) 00000-0000" />
        </Field>
      </div>

      <SectionTitle>Família</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome da esposa">
          <input {...register('nomeEsposa')} className={inputCls} placeholder="Nome da esposa" />
        </Field>
        <Field label="Nome da mãe">
          <input {...register('nomeMae')} className={inputCls} placeholder="Nome da mãe" />
        </Field>
      </div>

      <Field label="Número de parente">
        <input {...register('numeroParente')} className={inputCls} placeholder="(00) 00000-0000" />
      </Field>

      <SectionTitle>Informações adicionais</SectionTitle>

      <div className="space-y-2">
        <CheckField label="Já serviu (militar/missão)" {...register('jaServiu')} />
        <CheckField label="Possui certificado" {...register('certificado')} />
        <CheckField label="Problema de saúde" {...register('problemaDeSaude')} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors disabled:opacity-60 mt-2"
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
