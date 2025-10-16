import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as ChakraProvider } from '@/components/ui/provider'
import { queryClient } from '@/core/queryClient.ts'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  // StrictMode：開発環境だと2回レンダリング(コンポーネント2回描画)が走る仕様
  <StrictMode>
    {/* ChakraProvideでアプリをラップ */}
    <ChakraProvider>
      {/* QueryClientProviderでアプリをラップ */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)
