import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateTicketStatus } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type UpdateTicketStatusRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット更新（ステータス変更）
export const useUpdateTicketStatusMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation<UpdateTicketResponse, Error, UpdateTicketStatusRequest>({
    mutationFn: (request) => updateTicketStatus(ticketId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Ticket.detail(ticketId) })
    },
  })
}
