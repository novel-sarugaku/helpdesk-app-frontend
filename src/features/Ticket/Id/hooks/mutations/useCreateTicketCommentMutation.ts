import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTicketComment } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketCommentResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケットに対する質疑応答登録
export const useCreateTicketCommentMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation<CreateTicketCommentResponse, Error, CreateTicketCommentRequest>({
    mutationFn: (request) => createTicketComment(ticketId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Ticket.detail(ticketId) })
    },
  })
}
