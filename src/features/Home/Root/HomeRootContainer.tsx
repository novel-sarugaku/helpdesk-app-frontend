import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import { useHealthcheckAuthQuery } from '@/features/Login/Root/hooks/queries/useHealthcheckAuthQuery'

export const HomeRootContainer = () => {
  const { isError, isPending } = useHealthcheckAuthQuery()

  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return <Navigate to='/login' />
    return <HomeRootPresentational />
  }, [isPending, isError])
}
