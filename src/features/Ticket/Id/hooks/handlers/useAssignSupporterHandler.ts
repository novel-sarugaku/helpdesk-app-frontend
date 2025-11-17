import axios from 'axios'
import { toaster } from '@/components/ui/toaster'

import { useAssignSupporterMutation } from '@/features/Ticket/Id/hooks/mutations/useAssignSupporterMutation'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

export const useAssignSupporterHandler = (ticketId: number) => {
  const mutation = useAssignSupporterMutation(ticketId)

  const handleAssignSupporter = async () => {
    try {
      await mutation.mutateAsync()
      toaster.create({
        description: '担当者を割り当てました',
        type: 'success',
      })
    } catch (error) {
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? '担当者の割り当てに失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }
  return { handleAssignSupporter }
}
