import axios from 'axios'
import { toaster } from '@/components/ui/toaster'

import { useUpdateTicketVisibilityMutation } from '@/features/Ticket/Id/hooks/mutations/useUpdateTicketVisibilityMutation'
import { publicationTypeToJa } from '@/shared/logic/format/labelFormatters'
import { type UpdateTicketVisibilityRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

export const useUpdateTicketVisibilityHandler = (ticketId: number) => {
  const mutation = useUpdateTicketVisibilityMutation(ticketId)

  const handleUpdateTicketVisibility = async (visibility: UpdateTicketVisibilityRequest) => {
    try {
      await mutation.mutateAsync(visibility)

      // 日本語ラベルに変換
      const visibilityLabel = publicationTypeToJa(visibility.is_public)

      toaster.create({
        description: `チケット：${String(ticketId)} を ${visibilityLabel} に設定しました`,
        type: 'success',
      })
    } catch (error) {
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? '公開設定の変更に失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }
  return { handleUpdateTicketVisibility }
}
