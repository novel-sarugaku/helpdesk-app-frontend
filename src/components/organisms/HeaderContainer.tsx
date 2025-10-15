import { HeaderPresentational } from './HeaderPresentational'
import { useLogoutHandler } from '@/shared/hooks/handlers/useLogoutHandler'

export const HeaderContainer = () => {
  const { logout } = useLogoutHandler()
  return <HeaderPresentational logout={logout} />
}
