import axios from 'axios'
import { toaster } from '@/components/ui/toaster'

import { useCreateTicketCommentMutation } from '@/features/Ticket/Id/hooks/mutations/useCreateTicketCommentMutation'
import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

export const useCreateTicketCommentFormCardHandler = (ticketId: number) => {
  const mutation = useCreateTicketCommentMutation(ticketId)

  const handleCreateTicketComment = async (comment: CreateTicketCommentRequest) => {
    try {
      await mutation.mutateAsync(comment)

      toaster.create({
        description: `ID:${String(ticketId)} 質疑応答を送信しました`,
        type: 'success',
      })
    } catch (error) {
      // axios.isAxiosError(error) → そのエラーがAxiosのエラーかを判定する関数
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? 'チケットに対する質疑応答の登録に失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
      throw error
    }
  }

  return { handleCreateTicketComment }
}
