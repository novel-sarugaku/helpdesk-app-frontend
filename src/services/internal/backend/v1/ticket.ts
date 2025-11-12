import { internalBackendV1Client } from './client'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'
import {
  type GetTicketResponseItem,
  type GetTicketDetailResponse,
  type CreateTicketResponse,
} from '@/models/api/internal/backend/v1/response/ticket'

// チケット全件取得
export const getTickets = async (): Promise<GetTicketResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetTicketResponseItem[]>('/ticket')
  return response.data
}

// チケット詳細取得
export const getTicket = async (ticketId: number): Promise<GetTicketDetailResponse> => {
  const response = await internalBackendV1Client.get<GetTicketDetailResponse>(
    `/ticket/${String(ticketId)}`,
  )
  return response.data
}

// チケット登録
export const createTicket = async (request: CreateTicketRequest): Promise<CreateTicketResponse> => {
  const response = await internalBackendV1Client.post<CreateTicketResponse>('/ticket', request)
  return response.data
}
