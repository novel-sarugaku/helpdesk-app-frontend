import { describe, it, vi, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { Header } from '../Header'
import * as logout from '@/shared/hooks/handlers/useLogoutHandler'
import { type AccountType } from '@/models/constants/accountType'

const adminAccountType: AccountType = 'admin'
const userAccountTypes: AccountType[] = [adminAccountType, 'staff', 'supporter']
const defaultProps = {
  userAccountType: adminAccountType,
}

//  Mocking useLogoutHandler hook
const mockLogout = vi.fn()
vi.spyOn(logout, 'useLogoutHandler').mockReturnValue({ logout: mockLogout })

describe('Header', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<Header {...defaultProps} />)

      expect(screen.getByText('NOVEL HELPDESK')).toBeInTheDocument()
      expect(screen.getByText('Ticket')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it("リンク「NOVEL HELPDESK」や「Ticket」の href が、'/' である", () => {
      customRender(<Header {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'NOVEL HELPDESK' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/')
    })

    it('「Logout」を押下すると、logout が呼ばれる', () => {
      customRender(<Header {...defaultProps} />)

      fireEvent.click(screen.getByRole('heading', { name: 'Logout' }))

      expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    it('userAccountType が admin のとき、リンク「Account」と「|」が表示される', () => {
      customRender(<Header {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument()
      expect(screen.getByText('|')).toBeInTheDocument()
    })

    it('userAccountType が admin でないとき、リンク「Account」と「|」が表示されない', () => {
      userAccountTypes.forEach((type) => {
        if (type === 'admin') return

        customRender(<Header userAccountType={type} />)

        expect(screen.queryByRole('link', { name: 'Account' })).not.toBeInTheDocument()
        expect(screen.queryByText('|')).not.toBeInTheDocument()
      })
    })

    it("リンク「Account」の href が、'/admin/account' である", () => {
      customRender(<Header {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
        'href',
        '/admin/account',
      )
    })
  })
})
