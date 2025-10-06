// Reactルーティング（画面遷移）を行うためのもの
import { Route, Routes } from 'react-router-dom'

import { HomeRootContainer } from '@/features/Home/Root/HomeRootContainer'

// export：外部から参照できるようにするためのもの
export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomeRootContainer />} />
      </Routes>
    </>
  )
}
