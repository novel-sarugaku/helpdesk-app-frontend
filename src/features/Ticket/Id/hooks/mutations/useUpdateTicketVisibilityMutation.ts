import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateTicketVisibility } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type UpdateTicketVisibilityRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type UpdateTicketVisibilityResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット更新（公開設定変更）
export const useUpdateTicketVisibilityMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation<UpdateTicketVisibilityResponse, Error, UpdateTicketVisibilityRequest>({
    mutationFn: (request) => updateTicketVisibility(ticketId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Ticket.detail(ticketId) })
    },
  })
}
