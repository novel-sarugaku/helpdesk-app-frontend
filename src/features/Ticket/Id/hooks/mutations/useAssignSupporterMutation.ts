import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assignSupporter } from '@/services/internal/backend/v1/ticket'
import { Tickets } from '@/features/Home/Root/hooks/queries/queryKeys'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット更新（サポート担当者登録設定）
export const useAssignSupporterMutation = (ticketId: number) => {
  const queryClient = useQueryClient()
  return useMutation<UpdateTicketResponse>({
    mutationFn: () => assignSupporter(ticketId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Tickets.all })
      void queryClient.invalidateQueries({ queryKey: Ticket.detail(ticketId) })
    },
  })
}
