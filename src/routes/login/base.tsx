import { Route, Routes } from 'react-router-dom'

import { LoginRootContainer } from '@/features/Login/Root/LoginRootContainer'

export const LoginRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginRootContainer />} />
      </Routes>
    </>
  )
}
