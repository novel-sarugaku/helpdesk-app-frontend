import { internalBackendV1Client } from './client'

import {
  type CreateAccountRequest,
  type UpdateAccountRequest,
} from '@/models/api/internal/backend/v1/request/account'
import {
  type GetAccountResponseItem,
  type CreateAccountResponse,
  type UpdateAccountResponse,
} from '@/models/api/internal/backend/v1/response/account'

// アカウント全件取得
export const getAccounts = async (): Promise<GetAccountResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetAccountResponseItem[]>('/admin/account')
  return response.data
}

// アカウント登録
export const createAccount = async (
  request: CreateAccountRequest,
): Promise<CreateAccountResponse> => {
  const response = await internalBackendV1Client.post<CreateAccountResponse>(
    '/admin/account',
    request,
  )
  return response.data
}

// アカウント利用状態の更新
export const updateAccount = async (
  request: UpdateAccountRequest,
): Promise<UpdateAccountResponse> => {
  const response = await internalBackendV1Client.put<UpdateAccountResponse>(
    '/admin/account',
    request,
  )
  return response.data
}
