// Reactルーティング（画面遷移）を行うためのもの
import { Route, Routes } from 'react-router-dom'

import { HomeRootContainer } from '@/features/Home/Root/HomeRootContainer'
import { LoginRouter } from '@/routes/login/base'
import { AdminRouter } from '@/routes/admin/base'
import { TicketRouter } from '@/routes/ticket/base'

// export：外部から参照できるようにするためのもの
export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomeRootContainer />} />
        <Route path='/ticket/*' element={<TicketRouter />} />
        <Route path='/login/*' element={<LoginRouter />} />
        <Route path='/admin/*' element={<AdminRouter />} />
      </Routes>
    </>
  )
}
