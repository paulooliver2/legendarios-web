import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
        <input
          {...register('username')}
          autoComplete="username"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="seu.usuario"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="••••••"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {loginError && (
        <p className="text-red-500 text-sm text-center">Usuário ou senha inválidos.</p>
      )}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {isLoggingIn ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
