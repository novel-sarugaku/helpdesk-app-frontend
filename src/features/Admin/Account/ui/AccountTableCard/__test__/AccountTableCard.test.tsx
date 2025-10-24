import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

const mockGetAccountResponseItem: GetAccountResponseItem[] = [
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
const defaultProps = {
  allAccountsList: mockGetAccountResponseItem,
}

const headerRow = ['表示名', 'メールアドレス', 'アカウント種別']
const accountRows = [
  ['テストユーザー1', 'test1@example.com', '社員'],
  ['テストユーザー2', 'test2@example.com', 'サポート担当者'],
]

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
  })
})
