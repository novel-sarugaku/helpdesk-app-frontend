import { useQuery } from '@tanstack/react-query'

import { getTicket } from '@/services/internal/backend/v1/ticket'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import { type GetTicketDetailResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット詳細取得
export const useTicketDetailQuery = (ticketId: number) => {
  return useQuery<GetTicketDetailResponse>({
    queryKey: Ticket.detail(ticketId),
    queryFn: () => getTicket(ticketId),
    select: (data) => {
      // data(GetTicketDetailResponse) のうちの ticket_histories のデータを並び替え
      const dataSortedByDate = [...data.ticket_histories].sort((historyA, historyB) => {
        return new Date(historyB.created_at).getTime() - new Date(historyA.created_at).getTime() // 新しい方（数値が大きい方）を前に
      })
      // data の全プロパティをそのまま引き継ぎ、その上で ticket_histories だけを並べ替え後の配列に置き換えて返す
      return { ...data, ticket_histories: dataSortedByDate }
    },
  })
}
