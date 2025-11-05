interface TicketIdPresentationalProps {
  ticketId: number
}

export const TicketIdPresentational = ({ ticketId }: TicketIdPresentationalProps) => {
  return (
    <>
      <h1>チケットid {ticketId} の詳細画面</h1>
    </>
  )
}
