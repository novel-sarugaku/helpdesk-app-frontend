import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { Header } from '../Header'

describe('Header', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<Header />)

      expect(screen.getByText('NOVEL HELPDESK')).toBeInTheDocument()
      expect(screen.getByText('Ticket')).toBeInTheDocument()
    })

    it('リンク「NOVEL HELPDESK」や「Ticket」を押下するとチケット一覧画面に遷移する', () => {
      customRender(<Header />)

      expect(screen.getByRole('link', { name: 'NOVEL HELPDESK' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/')
    })
  })
})
