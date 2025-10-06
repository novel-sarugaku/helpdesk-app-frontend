// Chakra UIのProvider
import { Provider as ChakraUIProvider } from '@/components/ui/provider'
// React Queryのデータ管理を使えるようにするもの
import { QueryClientProvider } from '@tanstack/react-query'
// React Routerのテスト用のルーター
import { MemoryRouter } from 'react-router-dom'
// テスト専用のQueryClientを作る関数
import { createTestQueryClient } from '@/tests/config/testQueryClient'
// Reactの「子要素の型」。文字列・JSX・コンポーネントなどを全部含められる便利な型
import type { ReactNode } from 'react'

interface CustomRenderProviderProps {
  children: ReactNode // childrenとは「このコンポーネントの中に入れる子要素」のこと。実際にテストしたいコンポーネントがここに入る
}

// テスト時にReactコンポーネントを実際の環境と同じように動かせるようにするもの
export const CustomRenderProvider = ({ children }: CustomRenderProviderProps) => {
  return (
    <ChakraUIProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </ChakraUIProvider>
  )
}
