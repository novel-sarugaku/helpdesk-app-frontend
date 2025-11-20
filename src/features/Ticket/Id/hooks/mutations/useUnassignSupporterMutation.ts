import { useMutation, useQueryClient } from '@tanstack/react-query'

import { unassignSupporter } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット更新（サポート担当者解除設定）
export const useUnassignSupporterMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation<UpdateTicketResponse>({
    mutationFn: () => unassignSupporter(ticketId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Ticket.detail(ticketId) })
    },
  })
}
