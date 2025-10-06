// render：コンポーネントをテスト環境に描画して、テストで扱えるようにする
import { render } from '@testing-library/react'
// 「テスト環境用のラッパー」コンポーネント。React Query、Routerをまとめて提供してくれる
import { CustomRenderProvider } from '../providers/customRenderProvider'

// テスト時にコンポーネントを表示するとき、CustomRenderProviderで包んで実行するための関数
export const customRender = (ui: React.ReactElement) => {
  // uiは、テストしたいReactコンポーネント
  return render(<CustomRenderProvider>{ui}</CustomRenderProvider>)
}
