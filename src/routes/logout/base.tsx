import { Route, Routes } from 'react-router-dom'

import { LogoutRootContainer } from '@/features/Logout/Root/LogoutRootContainer'
export const LogoutRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LogoutRootContainer />} />
      </Routes>
    </>
  )
}
