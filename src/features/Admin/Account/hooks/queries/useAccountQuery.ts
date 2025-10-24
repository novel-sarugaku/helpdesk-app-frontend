import { useQuery } from '@tanstack/react-query'

import { getAccouns } from '@/services/internal/backend/v1/account'
import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'

// アカウント全件取得
export const useAccountQuery = () => {
  return useQuery<GetAccountResponse, Error, GetAccountResponse[]>({
    queryKey: Accounts.all,
    queryFn: getAccouns,
  })
}
