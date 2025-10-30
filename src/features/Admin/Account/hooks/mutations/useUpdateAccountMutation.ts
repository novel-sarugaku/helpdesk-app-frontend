import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import { updateAccount } from '@/services/internal/backend/v1/account'
import { type UpdateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type UpdateAccountResponse } from '@/models/api/internal/backend/v1/response/account'

// アカウント利用状態の更新
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<UpdateAccountResponse, Error, UpdateAccountRequest>({
    mutationFn: updateAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Accounts.all })
    },
  })
}
