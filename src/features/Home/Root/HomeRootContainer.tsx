import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'

export const HomeRootContainer = () => {
  const { data, isError, isPending } = useHealthcheckAuthQuery()

  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return <Navigate to='/login' />
    return <HomeRootPresentational userAccountType={data.account_type} />
  }, [isPending, isError, data])
}
