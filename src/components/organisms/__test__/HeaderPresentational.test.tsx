import { describe, it, vi, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HeaderPresentational } from '../HeaderPresentational'

const mockLogout = vi.fn()
const defaultProps = {
  logout: mockLogout,
}

describe('Header', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<HeaderPresentational {...defaultProps} />)

      expect(screen.getByText('NOVEL HELPDESK')).toBeInTheDocument()
      expect(screen.getByText('Ticket')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('リンク「NOVEL HELPDESK」や「Ticket」を押下するとチケット一覧画面に遷移する', () => {
      customRender(<HeaderPresentational {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'NOVEL HELPDESK' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/')
    })

    it('「Logout」を押下すると、logout が呼ばれる', () => {
      customRender(<HeaderPresentational {...defaultProps} />)

      fireEvent.click(screen.getByRole('heading', { name: 'Logout' }))

      expect(mockLogout).toHaveBeenCalledTimes(1)
    })
  })
})
