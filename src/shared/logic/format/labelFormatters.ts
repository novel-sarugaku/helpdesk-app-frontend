import type { AccountType } from '@/models/constants/accountType'

export const accountTypeToJa = (type: AccountType): string => {
  return { admin: '管理者', staff: '社員', supporter: 'サポート担当者' }[type] // [type] → 辞書から、変数 type で指定されたキーの値を取り出す
}
