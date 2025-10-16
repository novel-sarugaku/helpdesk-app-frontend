import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import { useLogoutHandler } from '@/shared/hooks/handlers/useLogoutHandler'
import { useHealthcheckAuthQuery } from '@/features/Login/Root/hooks/queries/useHealthcheckAuthQuery'

export const HomeRootContainer = () => {
  const { logout } = useLogoutHandler()
  const navigate = useNavigate()
  const { isError, isPending } = useHealthcheckAuthQuery()

  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return void navigate('/login')
    return <HomeRootPresentational logout={logout} />
  }, [logout, isPending, isError, navigate])
}
