import axios from 'axios'
import { toaster } from '@/components/ui/toaster'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

import { useUpdateAccountMutation } from '@/features/Admin/Account/hooks/mutations/useUpdateAccountMutation'
import { type UpdateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

export const useUpdateAccountHandler = () => {
  const mutation = useUpdateAccountMutation()

  const changeAccountStatus = async (account: GetAccountResponseItem) => {
    // is_suspended が true の時は false にする / false の時は trueにする
    const request: UpdateAccountRequest = {
      id: account.id,
      is_suspended: !account.is_suspended,
    }

    try {
      await mutation.mutateAsync(request)
      toaster.create({
        description: 'アカウント利用状態の更新が完了しました',
        type: 'success',
      })
    } catch (error) {
      // axios.isAxiosError(error) → そのエラーがAxiosのエラーかを判定する関数
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? 'アカウント利用状態を更新できませんでした')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }

  return { changeAccountStatus }
}
