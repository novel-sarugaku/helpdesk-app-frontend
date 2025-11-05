import { useQuery } from '@tanstack/react-query'

import { getTickets } from '@/services/internal/backend/v1/ticket'
import { Tickets } from '@/features/Home/Root/hooks/queries/queryKeys'
import { type GetTicketResponseItem } from '@/models/api/internal/backend/v1/response/ticket'

// チケット全件取得
export const useTicketQuery = () => {
  return useQuery<GetTicketResponseItem[]>({
    queryKey: Tickets.all,
    queryFn: getTickets,
    // 質問日時(created_at)を降順(新しい順)に並び替え
    // ticketA/ticketB → 並び替え中に比較される2つの要素
    // [...] → 配列のコピーを作る。
    // .sort((a, b) => 数値)：配列の中の2つの要素 a と b を比べて、どっちを先に並べるか決める関数（数字を小さい順
    // 例：数字を小さい順（昇順） → [3, 10, 2].sort((a, b) => a - b) → 2, 3, 10となる
    // 例：数字を大きい順（降順） → [3, 10, 2].sort((a, b) => b - a) → 10, 3, 2となる
    select: (data) => {
      const dataSortedByDate = [...data].sort((ticketA, ticketB) => {
        return new Date(ticketB.created_at).getTime() - new Date(ticketA.created_at).getTime() // 新しい方（数値が大きい方）を前に
      })
      return dataSortedByDate
    },
  })
}
