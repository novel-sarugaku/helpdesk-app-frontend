import { type TicketStatusType } from '@/models/constants/ticketStatusType'

export const ticketStatusTypeLabelList = [
  { label: '新規質問', value: 'start' },
  { label: '担当割り当て済み', value: 'assigned' },
  { label: '対応中', value: 'in_progress' },
  { label: '解決済み', value: 'resolved' },
  { label: 'クローズ', value: 'closed' },
] as { label: string; value: TicketStatusType }[]
