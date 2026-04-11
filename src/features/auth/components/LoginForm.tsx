import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'

const loginSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  const errorMessage = loginError
    ? 'Usuário ou senha inválidos.'
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <h1>Legendários</h1>

      <div>
        <label htmlFor="username">Usuário</label>
        <input id="username" {...register('username')} autoComplete="username" />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" {...register('password')} autoComplete="current-password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}

      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
