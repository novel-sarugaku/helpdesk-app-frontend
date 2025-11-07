import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTicket } from '@/services/internal/backend/v1/ticket'
import { Tickets } from '@/features/Home/Root/hooks/queries/queryKeys'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// チケット登録
export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateTicketResponse, Error, CreateTicketRequest>({
    mutationFn: createTicket,
    // 登録が成功した場合、チケット一覧表示キャッシュが無効化され、useQueryが自動で最新の一覧を再取得
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: Tickets.all })
    },
  })
}
