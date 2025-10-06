// React Hooks（useState, useEffect, useQueryなど）をテストするための関数
import { renderHook, type RenderHookOptions, type RenderHookResult } from '@testing-library/react'
// テスト時にReactコンポーネントを実際の環境と同じように動かせるようにするもの
import { CustomRenderProvider } from '../providers/customRenderProvider'

// フックをテスト環境（CustomRenderProvider：React Query, Router）の中で実行する関数
// <Result, Props>はTypeScriptの型パラメータ。Result → フックの戻り値の型。Props → フックに渡す引数の型
export const customRenderHook = <Result, Props>(
  callback: (initialProps: Props) => Result, // 実際にテストするフック
  options?: RenderHookOptions<Props>, // renderHookに渡せる追加オプション
): RenderHookResult<Result, Props> => {
  // renderHookの戻り値
  // renderHookを呼び出すときに、callback → 実際に実行するフック、wrapper:CustomRenderProvider → 必要な環境を包む、...options → オプションを追加を設定
  return renderHook(callback, {
    wrapper: CustomRenderProvider,
    ...options,
  })
}
