import { type AccountType } from '@/models/constants/accountType'

export type LoginResponse = {
  id: number
  name: string
  email: string
  account_type: AccountType
}
