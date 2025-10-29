import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { AdminAccountPresentational } from '@/features/Admin/Account/AdminAccountPresentational'
import * as Header from '@/components/organisms/Header'
import * as AccountTableCard from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

const mockUserAccountType: AccountType = 'admin'
const mockAllAccountsList: GetAccountResponseItem[] = [
  {
    id: 1,
    name: 'テストユーザー',
    email: 'test@example.com',
    account_type: 'admin',
  },
]
const mockHandleCreateAccount = vi.fn()
const mockIsDialogOpen = false
const mockOnDialogOpenChange = vi.fn()
const mockFormError = null
const mockSetFormError = vi.fn()
const defaultProps = {
  userAccountType: mockUserAccountType,
  allAccountsList: mockAllAccountsList,
  handleCreateAccount: mockHandleCreateAccount,
  isDialogOpen: mockIsDialogOpen,
  onDialogOpenChange: mockOnDialogOpenChange,
  formError: mockFormError,
  setFormError: mockSetFormError,
}

// Mocking the Header component
const mockHeader = vi.spyOn(Header, 'Header').mockImplementation(() => {
  return <div data-testid='mock-header'>Mocked Header</div>
})

// Mocking the AccountTableCard component
const mockAccountTableCard = vi
  .spyOn(AccountTableCard, 'AccountTableCard')
  .mockImplementation(() => {
    return <div data-testid='mock-accountTableCard'>Mocked AccountTableCard</div>
  })

describe('AdminAccountPresentational', () => {
  describe('正常系', () => {
    it('正しいpropsでHeaderコンポーネントが表示される', () => {
      customRender(<AdminAccountPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(mockHeader.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
        }),
      )
    })

    it('正しいpropsでAccountTableCardコンポーネントが表示される', () => {
      customRender(<AdminAccountPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-accountTableCard')).toBeInTheDocument()
      expect(mockAccountTableCard.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          allAccountsList: mockAllAccountsList,
          handleCreateAccount: mockHandleCreateAccount,
          isDialogOpen: mockIsDialogOpen,
          onDialogOpenChange: mockOnDialogOpenChange,
          formError: mockFormError,
          setFormError: mockSetFormError,
        }),
      )
    })
  })
})
