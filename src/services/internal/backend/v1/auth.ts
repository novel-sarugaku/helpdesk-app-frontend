import { internalBackendV1Client } from './client'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

// ログイン
export const postLogin = async (request: LoginRequest): Promise<void> => {
  await internalBackendV1Client.post('/auth/login', request)
}

// ログアウト
export const postLogout = async (): Promise<void> => {
  await internalBackendV1Client.post('/auth/logout')
}
