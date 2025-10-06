// React Queryで使う「データ管理の司令塔」
// サーバーからデータを取ってきたり（query）、データを送ったり（mutation）するときのルールをまとめている
import { QueryClient } from '@tanstack/react-query'

// テスト専用のQueryClientを作る関数
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      //テスト時標準ルールを設定
      // retry: false → リトライしない
      // experimental_prefetchInRender: true → コンポーネントの描画中にデータを先読みできるようにする
      mutations: { retry: false },
      queries: { retry: false, experimental_prefetchInRender: true },
    },
  })
