import { internalBackendV1Client } from './client'

import { type GetTicketResponseItem } from '@/models/api/internal/backend/v1/response/ticket'

// チケット全件取得
export const getTickets = async (): Promise<GetTicketResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetTicketResponseItem[]>('/ticket')
  return response.data
}
