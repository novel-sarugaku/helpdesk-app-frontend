import { type AccountType } from '@/models/constants/accountType'

export type GetAccountResponse = {
  id: number
  name: string
  email: string
  account_type: AccountType
}
