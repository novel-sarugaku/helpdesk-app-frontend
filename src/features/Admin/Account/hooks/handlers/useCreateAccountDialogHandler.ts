import { useState } from 'react'
import { useCreateAccountMutation } from '@/features/Admin/Account/hooks/mutations/useCreateAccountMutation'

import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'

export const useCreateAccountDialogHandler = () => {
  const mutation = useCreateAccountMutation()

  const [emailError, setEmailError] = useState<string | null>(null)

  const [isDialogOpen, setDialogOpen] = useState(false)

  // ダイアログの開閉が変わったときに呼ばれる関数
  const onDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
  }

  // 登録ボタンを押したときに呼ばれる関数
  const handleCreateAccount = (request: CreateAccountRequest) => {
    mutation.mutate(request)
    setDialogOpen(false) // 成功したら閉じる
  }

  return { handleCreateAccount, isDialogOpen, onDialogOpenChange, emailError, setEmailError }
}
