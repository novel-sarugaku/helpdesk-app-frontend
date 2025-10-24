import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { AdminAccountPresentational } from '@/features/Admin/Account/AdminAccountPresentational'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import { useAccountQuery } from '@/features/Admin/Account/hooks/queries/useAccountQuery'

export const AdminAccountContainer = () => {
  const { data, isError, isPending } = useHealthcheckAuthQuery()
  const { data: accountData = [] } = useAccountQuery() // dataがない場合は、空配列を入れる

  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return <Navigate to='/login' />
    return (
      <AdminAccountPresentational
        userAccountType={data.account_type}
        userAccountData={accountData}
      />
    )
  }, [isPending, isError, data, accountData])
}
