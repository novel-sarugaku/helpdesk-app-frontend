import { act } from 'react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { CreateAccountDialogCard } from '@/features/Admin/Account/ui/AccountCreateDialogCard/CreateAccountDialogCard'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'staff'
const mockGetAccountResponseItem: GetAccountResponseItem[] = [
  {
    id: 1,
    name: 'テストユーザー1',
    email: 'tes1@example.com',
    account_type: mockUserAccountType,
    is_suspended: false,
  },
  {
    id: 2,
    name: 'テストユーザー2',
    email: 'test2@example.com',
    account_type: mockUserAccountType,
    is_suspended: false,
  },
]
const mockAllAccountsList = mockGetAccountResponseItem
const mockHandleCreateAccount = vi.fn()
const mockIsDialogOpen = true
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

const emailDuplicatedProps = {
  ...defaultProps,
  formError: 'このメールアドレスは既に使用されています',
}

const mockName = 'テストユーザー3'
const mockEmail = 'tes3@example.com'
const mockPassword = 'testPass123'
const mockAccountType: AccountType = 'staff'
const mockCreateAccountRequest: CreateAccountRequest = {
  name: mockName,
  email: mockEmail,
  password: mockPassword,
  account_type: mockAccountType,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CreateAccountDialogCard', () => {
  describe('正常系', () => {
    it('アカウント登録ダイアログ上に表示されるべきテキストが表示され、input、select 要素に required が存在する', () => {
      customRender(<CreateAccountDialogCard {...defaultProps} />)

      expect(screen.getByText('表示名')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Pass')).toBeInTheDocument()
      expect(screen.getByText('種別')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('登録')).toBeInTheDocument()
      expect(screen.getByText('ADD')).toBeInTheDocument()
      expect(screen.getByTestId('add-icon')).toBeInTheDocument()

      // .toBeRequired()：requiredの存在を確認
      expect(screen.getByLabelText('表示名')).toBeRequired()
      expect(screen.getByLabelText('Email')).toBeRequired()
      expect(screen.getByLabelText('Pass')).toBeRequired()
      expect(screen.getByLabelText('種別', { selector: 'select' })).toBeRequired()
    })
  })

  it('表示名/Email/Pass/種別 を入力して送信すると、handleCreateAccount にリクエストが渡る', () => {
    customRender(<CreateAccountDialogCard {...defaultProps} />)

    // .change()：入力操作を再現
    fireEvent.change(screen.getByLabelText('表示名'), { target: { value: mockName } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: mockEmail } })
    fireEvent.change(screen.getByLabelText('Pass'), { target: { value: mockPassword } })
    fireEvent.change(screen.getByLabelText('種別', { selector: 'select' }), {
      target: { value: mockAccountType },
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: '登録' }))
    })

    expect(mockHandleCreateAccount).toHaveBeenCalledTimes(1)
    expect(mockHandleCreateAccount).toHaveBeenCalledWith(mockCreateAccountRequest)
  })

  it('メール欄の内容が変わったら setFormError(null) が呼ばれてメッセージ解除される', () => {
    customRender(<CreateAccountDialogCard {...emailDuplicatedProps} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: mockEmail } })
    expect(mockSetFormError).toHaveBeenCalledWith(null)
  })

  it('パスワード欄に pattern/title 属性が付いている（8文字以上かつ大文字と数字を各1以上）', () => {
    customRender(<CreateAccountDialogCard {...defaultProps} />)

    expect(screen.getByLabelText('Pass')).toHaveAttribute('pattern', '(?=.*[A-Z])(?=.*\\d).{8,}')
    expect(screen.getByLabelText('Pass')).toHaveAttribute(
      'title',
      '8文字以上・大文字と数字を各1文字以上含めてください',
    )
  })

  it('種別メニューを開くと「社員」「サポート担当者」が表示される（管理者は非表示）', async () => {
    customRender(<CreateAccountDialogCard {...defaultProps} />)

    // 「種別」の combobox をクリックしてメニューを開く
    // ChakraUIのSelect コンポーネント → WAI-ARIA の標準ロール(Webのアクセシビリティ仕様)
    // Select.Trigger → combobox（開閉ボタン）
    // Select.Content → listbox（開いた候補のリスト）
    // Select.Item → option（各候補）
    fireEvent.click(screen.getByRole('combobox', { name: '種別' }))

    // await screen.findByRole('listbox') → role が listbox の要素が画面に現れるまで待ってから取ってくる
    // within() → さっき見つけた listbox の中だけを検索対象に限定
    expect(
      within(await screen.findByRole('listbox')).getByRole('option', { name: '社員' }),
    ).toBeInTheDocument()
    expect(
      within(await screen.findByRole('listbox')).getByRole('option', { name: 'サポート担当者' }),
    ).toBeInTheDocument()
    expect(
      within(await screen.findByRole('listbox')).queryByRole('option', { name: '管理者' }),
    ).toBeNull() // 管理者は非表示
  })
})
