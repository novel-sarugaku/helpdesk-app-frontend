import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import * as CreateAccountDialogCard from '@/features/Admin/Account/ui/AccountCreateDialogCard/CreateAccountDialogCard'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

const mockAllAccountsList: GetAccountResponseItem[] = [
  {
    id: 1,
    name: 'テストユーザー1',
    email: 'test1@example.com',
    account_type: 'staff',
  },
  {
    id: 2,
    name: 'テストユーザー2',
    email: 'test2@example.com',
    account_type: 'supporter',
  },
]
const mockHandleCreateAccount = vi.fn()
const mockIsDialogOpen = false
const mockOnDialogOpenChange = vi.fn()
const mockFormError = null
const mockSetFormError = vi.fn()
const defaultProps = {
  allAccountsList: mockAllAccountsList,
  handleCreateAccount: mockHandleCreateAccount,
  isDialogOpen: mockIsDialogOpen,
  onDialogOpenChange: mockOnDialogOpenChange,
  formError: mockFormError,
  setFormError: mockSetFormError,
}

const headerRow = ['表示名', 'メールアドレス', 'アカウント種別']
const accountRows = [
  ['テストユーザー1', 'test1@example.com', '社員'],
  ['テストユーザー2', 'test2@example.com', 'サポート担当者'],
]

// Mocking the CreateAccountDialogCard component
const mockCreateAccountDialogCard = vi
  .spyOn(CreateAccountDialogCard, 'CreateAccountDialogCard')
  .mockImplementation(() => {
    return <div data-testid='mock-createAccountDialogCard'>Mocked CreateAccountDialogCard</div>
  })

describe('AccountTableCard', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<AccountTableCard {...defaultProps} />)

      expect(screen.getByText('Account 一覧')).toBeInTheDocument()

      headerRow.forEach((tableHeader) => {
        expect(screen.getByText(tableHeader)).toBeInTheDocument()
      })

      accountRows.forEach((tableRows) => {
        tableRows.forEach((tableCell) => {
          expect(screen.getByText(tableCell)).toBeInTheDocument()
        })
      })
    })

    it('正しいpropsでCreateAccountDialogCardコンポーネントが表示される', () => {
      customRender(<AccountTableCard {...defaultProps} />)

      expect(screen.getByTestId('mock-createAccountDialogCard')).toBeInTheDocument()
      expect(mockCreateAccountDialogCard.mock.calls[0][0]).toEqual(
        expect.objectContaining({
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
