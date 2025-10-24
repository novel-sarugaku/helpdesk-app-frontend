import { internalBackendV1Client } from './client'

import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'

// アカウント全件取得
export const getAccouns = async (): Promise<GetAccountResponse> => {
  const response = await internalBackendV1Client.get<GetAccountResponse>('/admin/account')
  return response.data
}
