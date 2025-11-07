import axios from 'axios'
import { useState } from 'react'
import { toaster } from '@/components/ui/toaster'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

import { useCreateTicketMutation } from '@/features/Home/Root/hooks/mutations/useCreateTicketMutation'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'

export const useCreateTicketDialogCardHandler = () => {
  const mutation = useCreateTicketMutation()

  const [isDialogOpen, setDialogOpen] = useState(false)

  // ダイアログの開閉が変わったときに呼ばれる関数
  const onDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
  }

  // 登録ボタンを押したときに呼ばれる関数
  const handleCreateTicket = async (request: CreateTicketRequest) => {
    try {
      await mutation.mutateAsync(request)
      toaster.create({
        description: `【チケット：${request.title}】が登録されました。`,
        type: 'success',
      })
      setDialogOpen(false) // 成功したら閉じる// エラーメッセージ非表示
    } catch (error) {
      // axios.isAxiosError(error) → そのエラーがAxiosのエラーかを判定する関数
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? 'チケットの登録に失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }

  return { handleCreateTicket, isDialogOpen, onDialogOpenChange }
}
