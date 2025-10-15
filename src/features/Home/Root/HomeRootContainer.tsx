import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import { useLogoutHandler } from '@/shared/hooks/handlers/useLogoutHandler'

export const HomeRootContainer = () => {
  const { logout } = useLogoutHandler()
  return (
    <>
      <HomeRootPresentational logout={logout} />
    </>
  )
}
