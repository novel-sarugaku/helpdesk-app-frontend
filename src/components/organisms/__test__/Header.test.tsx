import { describe, it, vi, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { Header } from '../Header'
import * as logout from '@/shared/hooks/handlers/useLogoutHandler'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'

const mockAdminAccountType: HealthcheckAuthResponse = 'admin'
const defaultProps = {
  userAccountType: mockAdminAccountType,
}

const mockStaffAccountType: HealthcheckAuthResponse = 'staff'
const staffProps = {
  userAccountType: mockStaffAccountType,
}

const mockSupporterAccountType: HealthcheckAuthResponse = 'supporter'
const supporterProps = {
  userAccountType: mockSupporterAccountType,
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

    it('リンク「NOVEL HELPDESK」や「Ticket」を押下するとチケット一覧画面に遷移する', () => {
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

    it('userAccountType が staff のとき、リンク「Account」と「|」が表示されない', () => {
      customRender(<Header {...staffProps} />)

      expect(screen.queryByRole('link', { name: 'Account' })).not.toBeInTheDocument()
      expect(screen.queryByText('|')).not.toBeInTheDocument()
    })

    it('userAccountType が supporter のとき、リンク「Account」と「|」が表示されない', () => {
      customRender(<Header {...supporterProps} />)

      expect(screen.queryByRole('link', { name: 'Account' })).not.toBeInTheDocument()
      expect(screen.queryByText('|')).not.toBeInTheDocument()
    })

    it('リンク「Account」を押下するとアカウント管理画面に遷移する', () => {
      customRender(<Header {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
        'href',
        '/admin/account',
      )
    })
  })
})
