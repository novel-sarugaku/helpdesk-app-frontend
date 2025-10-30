import { type AccountType } from '@/models/constants/accountType'

export type GetAccountResponseItem = {
  id: number
  name: string
  email: string
  account_type: AccountType
  is_suspended: boolean
}

export type CreateAccountResponse = {
  id: number
  name: string
  email: string
  account_type: AccountType
}

export type UpdateAccountResponse = {
  id: number
  name: string
  email: string
  account_type: AccountType
  is_suspended: boolean
}
