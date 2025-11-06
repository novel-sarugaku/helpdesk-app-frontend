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
