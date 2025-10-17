import { internalBackendV1Client } from './client'

// Promiseは空の箱 → async/awaitで中身に何か入るのを待つ
// 認証ヘルスチェック（アクセストークン確認）
export const getHealthcheckAuth = async (): Promise<void> => {
  await internalBackendV1Client.get('/healthcheck/auth')
}
