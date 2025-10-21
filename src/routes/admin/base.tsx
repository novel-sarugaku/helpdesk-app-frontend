import { Route, Routes } from 'react-router-dom'

import { AdminAccountContainer } from '@/features/Admin/Account/AdminAccountContainer'

export const AdminRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/account' element={<AdminAccountContainer />} />
      </Routes>
    </>
  )
}
