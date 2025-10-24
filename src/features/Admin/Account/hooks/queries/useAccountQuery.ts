import { useQuery } from '@tanstack/react-query'

import { getAccounts } from '@/services/internal/backend/v1/account'
import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

// アカウント全件取得
export const useAccountQuery = () => {
  return useQuery<GetAccountResponseItem[]>({
    queryKey: Accounts.all,
    queryFn: getAccounts,
  })
}
