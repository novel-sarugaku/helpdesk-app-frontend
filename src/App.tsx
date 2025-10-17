import { AppRouter } from 'src/routes/home'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  )
}

// export function App() {}と同じ役割
export default App
