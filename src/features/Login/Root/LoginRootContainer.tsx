import { LoginRootPresentational } from '@/features/Login/Root/LoginRootPresentational'
import { useLoginHandler } from '@/features/Login/Root/hooks/handlers/useLoginHandler'

export const LoginRootContainer = () => {
  const { login, isError } = useLoginHandler()
  return <LoginRootPresentational login={login} isError={isError} />
}
