import { useQuery } from '@tanstack/react-query'

import { getTicket } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type GetTicketDetailResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット詳細取得
export const useTicketDetailQuery = (ticketId: number) => {
  return useQuery<GetTicketDetailResponse>({
    queryKey: Ticket.detail(ticketId),
    queryFn: () => getTicket(ticketId),
  })
}
