import { internalBackendV1Client } from './client'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'
import { type LoginResponse } from '@/models/api/internal/backend/v1/response/auth'

// ログイン
export const postLogin = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await internalBackendV1Client.post<LoginResponse>('/auth/login', request)
  return response.data
}

// ログアウト
export const postLogout = async (): Promise<void> => {
  await internalBackendV1Client.post('/auth/logout')
}
