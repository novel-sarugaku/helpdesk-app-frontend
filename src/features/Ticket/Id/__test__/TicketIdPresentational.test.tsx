import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { TicketIdPresentational } from '@/features/Ticket/Id/TicketIdPresentational'

const mockTicketId = 1
const defaultProps = {
  ticketId: mockTicketId,
}

describe('TicketIdPresentational', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByText('チケットid 1 の詳細画面')).toBeInTheDocument()
    })
  })
})
