import { describe, it, expect, vi } from 'vitest'
import { screen, within } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import * as Header from '@/components/organisms/Header'
import * as TicketCreateDialogCard from '@/features/Home/Root/ui/TicketCreateDialogCard/TicketCreateDialogCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetTicketResponseItem } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

// Mocking the Header component
const mockHeader = vi.spyOn(Header, 'Header').mockImplementation(() => {
  return <div data-testid='mock-header'>Mocked Header</div>
})

// Mocking the TicketCreateDialogCard component
const mockTicketCreateDialogCard = vi
  .spyOn(TicketCreateDialogCard, 'TicketCreateDialogCard')
  .mockImplementation(() => {
    return <div data-testid='mock-ticketCreateDialogCard'>Mocked TicketCreateDialogCard</div>
  })

const mockUserAccountType: AccountType = 'staff'
const mockTicketStatusTypeIsStart: TicketStatusType = 'start'
const mockTicketStatusTypeIsAssigned: TicketStatusType = 'assigned'
const mockAllTicketsList: GetTicketResponseItem[] = [
  {
    id: 1,
    title: 'テストチケット1',
    is_public: true,
    status: mockTicketStatusTypeIsStart,
    staff: 'テスト社員1',
    supporter: 'テストサポート担当者1',
    created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'テストチケット2',
    is_public: true,
    status: mockTicketStatusTypeIsStart,
    staff: 'テスト社員2',
    supporter: 'テストサポート担当者2',
    created_at: '2025-11-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'テストチケット3',
    is_public: true,
    status: mockTicketStatusTypeIsAssigned,
    staff: 'テスト社員3',
    supporter: 'テストサポート担当者3',
    created_at: '2025-11-03T00:00:00Z',
  },
]
const mockHandleCreateTicket = vi.fn()
const mockIsDialogOpen = false
const mockOnDialogOpenChange = vi.fn()
const defaultProps = {
  userAccountType: mockUserAccountType,
  allTicketsList: mockAllTicketsList,
  handleCreateTicket: mockHandleCreateTicket,
  isDialogOpen: mockIsDialogOpen,
  onDialogOpenChange: mockOnDialogOpenChange,
}

const userAccountTypes: AccountType[] = ['admin', 'staff', 'supporter']

const headerRow = ['質問日', 'タイトル', '公開状況', 'ステータス', '質問者', 'サポート担当']
const accountRows = [
  ['2025 11 01', 'テストチケット1', '公開', '新規質問', 'テスト社員1', 'テストサポート担当者1'],
  ['2025 11 02', 'テストチケット2', '公開', '新規質問', 'テスト社員2', 'テストサポート担当者2'],
  [
    '2025 11 03',
    'テストチケット3',
    '公開',
    '担当者割り当て済み',
    'テスト社員3',
    'テストサポート担当者3',
  ],
]

describe('HomeRootPresentational', () => {
  describe('正常系', () => {
    it('正しいpropsでHeaderコンポーネントが表示される', () => {
      customRender(<HomeRootPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(mockHeader.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
        }),
      )
    })

    it('アカウントタイプが社員の場合、正しいpropsでTicketCreateDialogCardPropsコンポーネントが表示される', () => {
      customRender(<HomeRootPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-ticketCreateDialogCard')).toBeInTheDocument()
      expect(mockTicketCreateDialogCard.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          handleCreateTicket: mockHandleCreateTicket,
          isDialogOpen: mockIsDialogOpen,
          onDialogOpenChange: mockOnDialogOpenChange,
        }),
      )
    })

    it('アカウントタイプが社員以外の場合、TicketCreateDialogCardPropsコンポーネントは表示されない', () => {
      userAccountTypes.forEach((type) => {
        if (type === 'staff') return

        customRender(<HomeRootPresentational {...defaultProps} userAccountType={type} />)

        expect(screen.queryByTestId('mock-ticketCreateDialogCard')).not.toBeInTheDocument()
      })
    })

    it('表示されるべきテキストやデータが表示される', () => {
      customRender(<HomeRootPresentational {...defaultProps} />)

      expect(screen.getByText('Ticket')).toBeInTheDocument()

      headerRow.forEach((tableHeader) => {
        expect(screen.getByText(tableHeader)).toBeInTheDocument()
      })

      // 配列1行分を取り出して、created_at, title, publication, status, staff, supporter の変数に順番で分解して代入
      for (const [created_at, title, is_public, status, staff, supporter] of accountRows) {
        // タイトル文字を含むセルを見つけ、そのセルに最も近い該当の表の1行(<tr>)を取得
        const row = screen.getByText(title).closest('tr')
        if (row) {
          // within(row) → 上記で取得した行の中だけを探す
          expect(within(row).getByText(created_at)).toBeInTheDocument()
          expect(within(row).getByText(title)).toBeInTheDocument()
          expect(within(row).getByText(is_public)).toBeInTheDocument()
          expect(within(row).getByText(status)).toBeInTheDocument()
          expect(within(row).getByText(staff)).toBeInTheDocument()
          expect(within(row).getByText(supporter)).toBeInTheDocument()
        }
      }
    })

    it('表示されているチケットのタイトルのリンク遷移先が正しい', () => {
      customRender(<HomeRootPresentational {...defaultProps} />)

      expect(screen.getByRole('link', { name: 'テストチケット1' })).toHaveAttribute(
        'href',
        '/ticket/1',
      )
      expect(screen.getByRole('link', { name: 'テストチケット2' })).toHaveAttribute(
        'href',
        '/ticket/2',
      )
      expect(screen.getByRole('link', { name: 'テストチケット2' })).toHaveAttribute(
        'href',
        '/ticket/2',
      )
    })
  })
})
