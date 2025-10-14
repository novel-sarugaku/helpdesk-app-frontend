import { z } from 'zod'

// ルール定義（Zodのスキーマ）
// VITE_BACKEND_URL はURL形式であること
// もし未設定なら http://localhost:8000 を既定値にする。
const envSchema = z.object({
  VITE_BACKEND_URL: z.url().default('http://localhost:8000'),
})

// 実際の環境変数を読み込み & 検証
// import.meta.env（Viteが.envから読み込んだ値）をZodでチェック
// 不正（例: localhost:8000 のように http:// が無い）が見つかれば起動時にエラーにして気づける。
const env = envSchema.parse({
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
})

// アプリで使いやすい形に整形してexport
// 以後は config.backendUrl を参照すればOK。型も保証されて安心。
export const config = {
  backendUrl: env.VITE_BACKEND_URL,
}
