import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <LoginForm />
    </div>
  )
}
