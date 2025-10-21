import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { AdminAccountPresentational } from '@/features/Admin/Account/AdminAccountPresentational'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'

export const AdminAccountContainer = () => {
  const { data, isError, isPending } = useHealthcheckAuthQuery()

  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return <Navigate to='/login' />
    return <AdminAccountPresentational userAccountType={data.account_type} />
  }, [isPending, isError, data])
}
