import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type CreateAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import { createAccount } from '@/services/internal/backend/v1/account'

// アカウント登録
export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateAccountResponse, Error, CreateAccountRequest>({
    mutationFn: createAccount,
    // 登録が成功した場合、アカウント一覧表示キャッシュが無効化され、useQueryが自動で最新の一覧を再取得
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Accounts.all })
    },
  })
}
