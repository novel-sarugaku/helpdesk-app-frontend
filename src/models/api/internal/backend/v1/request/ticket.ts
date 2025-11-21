import { type TicketStatusType } from '@/models/constants/ticketStatusType'

export type CreateTicketRequest = {
  title: string
  is_public: boolean
  description: string
}

export type CreateTicketCommentRequest = {
  comment: string
}

export type UpdateTicketStatusRequest = {
  status: TicketStatusType
}
