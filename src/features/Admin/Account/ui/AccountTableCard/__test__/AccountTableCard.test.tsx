import { describe, it, expect, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
    is_suspended: true,
  },
  {
    id: 2,
    name: 'テストユーザー2',
    email: 'test2@example.com',
    account_type: 'supporter',
    is_suspended: false,
  },
]
const mockHandleCreateAccount = vi.fn()
const mockIsDialogOpen = false
const mockOnDialogOpenChange = vi.fn()
const mockFormError = null
const mockSetFormError = vi.fn()
const mockChangeAccountStatus = vi.fn()
const defaultProps = {
  allAccountsList: mockAllAccountsList,
  handleCreateAccount: mockHandleCreateAccount,
  isDialogOpen: mockIsDialogOpen,
  onDialogOpenChange: mockOnDialogOpenChange,
  formError: mockFormError,
  setFormError: mockSetFormError,
  changeAccountStatus: mockChangeAccountStatus,
}

const headerRow = ['表示名', 'メールアドレス', 'アカウント種別', '利用状態（停止/再開）']
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
      expect(screen.getAllByRole('button', { name: '再開' })).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: '停止' })).toHaveLength(1)
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

    it('「再開/停止」ボタンを押下すると changeAccountStatus が呼ばれる', async () => {
      customRender(<AccountTableCard {...defaultProps} />)

      // 1行目
      const accountRow1 = screen.getByRole('row', { name: /テストユーザー1/ }) // テストユーザー1 を含む行取得
      const resumeButton = within(accountRow1).getByRole('button', { name: '再開' }) // within() → 見つけた行の中だけを検索範囲にする。その行の中で、再開という名前のボタンを取得
      await userEvent.click(resumeButton) // ユーザーのクリックを再現

      expect(mockChangeAccountStatus).toHaveBeenCalledTimes(1)
      expect(mockChangeAccountStatus).toHaveBeenCalledWith(mockAllAccountsList[0])

      // 2行目
      const accountRow2 = screen.getByRole('row', { name: /テストユーザー2/ })
      const stopButton = within(accountRow2).getByRole('button', { name: '停止' })
      await userEvent.click(stopButton)

      expect(mockChangeAccountStatus).toHaveBeenCalledTimes(2)
      expect(mockChangeAccountStatus).toHaveBeenCalledWith(mockAllAccountsList[1])
    })
  })
})
