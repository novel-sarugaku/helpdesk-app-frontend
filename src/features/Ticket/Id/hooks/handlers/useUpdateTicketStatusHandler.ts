import axios from 'axios'
import { toaster } from '@/components/ui/toaster'

import { useUpdateTicketStatusMutation } from '@/features/Ticket/Id/hooks/mutations/useUpdateTicketStatusMutation'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

export const useUpdateTicketStatusHandler = (ticketId: number) => {
  const mutation = useUpdateTicketStatusMutation(ticketId)

  const handleUpdateTicketStatus = async (newStatus: TicketStatusType) => {
    try {
      await mutation.mutateAsync({
        status: newStatus,
      })
    } catch (error) {
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? 'ステータスの変更に失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }
  return { handleUpdateTicketStatus }
}
