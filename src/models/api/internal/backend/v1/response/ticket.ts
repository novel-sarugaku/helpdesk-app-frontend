import { type TicketStatusType } from '@/models/constants/ticketStatusType'

export type GetTicketResponseItem = {
  id: number
  title: string
  is_public: boolean
  status: TicketStatusType
  staff: string
  supporter: string
  created_at: string
}

export type GetTicketHistoryResponseItem = {
  id: number
  ticket: number
  action_user: string | null
  action_description: string
  created_at: string
}

export type GetTicketDetailResponse = {
  id: number
  title: string
  is_public: boolean
  status: TicketStatusType
  description: string
  supporter: string | null
  created_at: string
  is_own_ticket: boolean
  ticket_histories: GetTicketHistoryResponseItem[]
}

export type CreateTicketResponse = {
  id: number
  title: string
  is_public: boolean
  status: TicketStatusType
  description: string
  staff: number
  created_at: string
}

export type CreateTicketCommentResponse = {
  id: number
  action_user: string
  comment: string
}

export type UpdateTicketResponse = {
  id: number
  status: TicketStatusType
  supporter: string | null
}
