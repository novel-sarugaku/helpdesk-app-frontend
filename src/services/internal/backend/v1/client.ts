import { config } from '@/core/config' // 環境変数を読み込む
import { createBaseClient } from '@/services/base/client'

// internalBackendV1Client を使って各APIモジュールからリクエストを送る
export const internalBackendV1Client = createBaseClient({
  // 例）http://localhost:8000/api/v1 のようなAPIの共通プレフィックス
  baseURL: `${config.backendUrl}/api/v1`,
  // 各リクエストのタイムアウト（ミリ秒）。10秒で応答がなければエラーにする
  timeout: 10000,
  // Cookie を自動で送受信するかどうか
  withCredentials: true, // ← true = する
})
