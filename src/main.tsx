import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ChakraProvider } from '@/components/ui/provider'

// QueryClientのインスタンスを作成
const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
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
