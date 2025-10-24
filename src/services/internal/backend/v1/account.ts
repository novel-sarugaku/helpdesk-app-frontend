import { internalBackendV1Client } from './client'

import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

// アカウント全件取得
export const getAccounts = async (): Promise<GetAccountResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetAccountResponseItem[]>('/admin/account')
  return response.data
}
