import { type AccountType } from '@/models/constants/accountType'

export type CreateAccountRequest = {
  name: string
  email: string
  password: string
  account_type: AccountType
}
