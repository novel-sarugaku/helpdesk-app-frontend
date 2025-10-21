import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { AdminAccountPresentational } from '@/features/Admin/Account/AdminAccountPresentational'
import * as Header from '@/components/organisms/Header'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'admin'
const defaultProps = {
  userAccountType: mockUserAccountType,
}

// Mocking the Header component
const mockHeader = vi.spyOn(Header, 'Header').mockImplementation(() => {
  return <div data-testid='mock-header'>Mocked Header</div>
})

describe('AdminAccountPresentational', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<AdminAccountPresentational {...defaultProps} />)

      expect(screen.getByText('アカウント管理画面')).toBeInTheDocument()
    })

    it('正しいpropsでHeaderコンポーネントが表示される', () => {
      customRender(<AdminAccountPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(mockHeader.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
        }),
      )
    })
  })
})
