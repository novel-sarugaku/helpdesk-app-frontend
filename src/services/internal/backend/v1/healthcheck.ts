import { internalBackendV1Client } from './client'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'

// Promiseは空の箱 → async/awaitで中身に何か入るのを待つ
// 認証ヘルスチェック（アクセストークン確認）
export const getHealthcheckAuth = async (): Promise<HealthcheckAuthResponse> => {
  const response = await internalBackendV1Client.get<HealthcheckAuthResponse>('/healthcheck/auth')
  return response.data
}
