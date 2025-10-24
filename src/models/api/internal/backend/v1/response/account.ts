import { type AccountType } from '@/models/constants/accountType'

export type GetAccountResponseItem = {
  id: number
  name: string
  email: string
  account_type: AccountType
}
