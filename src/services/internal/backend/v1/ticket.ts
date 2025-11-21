import { internalBackendV1Client } from './client'
import {
  type CreateTicketRequest,
  type CreateTicketCommentRequest,
  type UpdateTicketStatusRequest,
} from '@/models/api/internal/backend/v1/request/ticket'
import {
  type GetTicketResponseItem,
  type GetTicketDetailResponse,
  type CreateTicketResponse,
  type CreateTicketCommentResponse,
  type UpdateTicketResponse,
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

// チケットに対する質疑応答登録
export const createTicketComment = async (
  ticketId: number,
  request: CreateTicketCommentRequest,
): Promise<CreateTicketCommentResponse> => {
  const response = await internalBackendV1Client.post<CreateTicketCommentResponse>(
    `/ticket/${String(ticketId)}/comments`,
    request,
  )
  return response.data
}

// チケット更新（サポート担当者登録設定）
export const assignSupporter = async (ticketId: number): Promise<UpdateTicketResponse> => {
  const response = await internalBackendV1Client.put<UpdateTicketResponse>(
    `/ticket/${String(ticketId)}/assign`,
  )
  return response.data
}

// チケット更新（サポート担当者解除設定）
export const unassignSupporter = async (ticketId: number): Promise<UpdateTicketResponse> => {
  const response = await internalBackendV1Client.put<UpdateTicketResponse>(
    `/ticket/${String(ticketId)}/unassign`,
  )
  return response.data
}

// チケット更新（ステータス変更）
export const updateTicketStatus = async (
  ticketId: number,
  request: UpdateTicketStatusRequest,
): Promise<UpdateTicketResponse> => {
  const response = await internalBackendV1Client.put<UpdateTicketResponse>(
    `/ticket/${String(ticketId)}/status`,
    request,
  )
  return response.data
}
