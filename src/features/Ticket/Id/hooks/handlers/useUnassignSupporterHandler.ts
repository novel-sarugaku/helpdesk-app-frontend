import axios from 'axios'
import { toaster } from '@/components/ui/toaster'

import { useUnassignSupporterMutation } from '@/features/Ticket/Id/hooks/mutations/useUnassignSupporterMutation'
import { type ErrorResponse } from '@/models/api/internal/backend/v1/response/error'

export const useUnassignSupporterHandler = (ticketId: number) => {
  const mutation = useUnassignSupporterMutation(ticketId)

  const handleUnassignSupporter = async () => {
    try {
      await mutation.mutateAsync()
      toaster.create({
        description: '担当者を解除しました',
        type: 'success',
      })
    } catch (error) {
      const errorMessage = axios.isAxiosError<ErrorResponse>(error)
        ? (error.response?.data.detail ?? '担当者の解除に失敗しました')
        : '通信エラーが発生しました'
      toaster.create({
        description: errorMessage,
        type: 'error',
      })
    }
  }
  return { handleUnassignSupporter }
}
