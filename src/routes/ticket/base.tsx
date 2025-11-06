import { Route, Routes } from 'react-router-dom'
import { TicketIdContainer } from '@/features/Ticket/Id/TicketIdContainer'

export const TicketRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/:id' element={<TicketIdContainer />} />
      </Routes>
    </>
  )
}
