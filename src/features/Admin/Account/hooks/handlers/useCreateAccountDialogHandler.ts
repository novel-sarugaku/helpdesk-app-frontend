import axios from 'axios'
import { useState } from 'react'

import { useCreateAccountMutation } from '@/features/Admin/Account/hooks/mutations/useCreateAccountMutation'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

export const useCreateAccountDialogHandler = () => {
  const mutation = useCreateAccountMutation()

  const [formError, setFormError] = useState<string | null>(null)

  const [isDialogOpen, setDialogOpen] = useState(false)

  // ダイアログの開閉が変わったときに呼ばれる関数
  const onDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setFormError(null)
  }

  // 登録ボタンを押したときに呼ばれる関数
  const handleCreateAccount = async (request: CreateAccountRequest) => {
    try {
      await mutation.mutateAsync(request)
      setDialogOpen(false) // 成功したら閉じる
      setFormError(null) // エラーメッセージ非表示
    } catch (error) {
      // axios.isAxiosError(error) → そのエラーがAxiosのエラーかを判定する関数
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? 'アカウントの作成に失敗しました')
        : '通信エラーが発生しました'

      setFormError(errorMessage)
    }
  }

  return { handleCreateAccount, isDialogOpen, onDialogOpenChange, formError, setFormError }
}
