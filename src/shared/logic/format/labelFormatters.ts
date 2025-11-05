import type { AccountType } from '@/models/constants/accountType'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

export const accountTypeToJa = (type: AccountType): string => {
  return { admin: '管理者', staff: '社員', supporter: 'サポート担当者' }[type] // [type] → 辞書から、変数 type で指定されたキーの値を取り出す
}

export const publicationTypeToJa = (isPublic: boolean): string => {
  return isPublic ? '公開' : '非公開'
}

export const ticketStatusToJa = (type: TicketStatusType): string => {
  return {
    start: '新規質問',
    assigned: '担当者割り当て済み',
    in_progress: '対応中',
    resolved: '解決済み',
    closed: 'クローズ',
  }[type]
}
