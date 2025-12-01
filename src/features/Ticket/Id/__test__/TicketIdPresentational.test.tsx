import { describe, it, vi, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { customRender } from '@/tests/helpers/customRender'
import { TicketIdPresentational } from '@/features/Ticket/Id/TicketIdPresentational'
import * as Header from '@/components/organisms/Header'
import * as CreateTicketCommentFormCard from '@/features/Ticket/Id/ui/CreateTicketCommentFormCard/CreateTicketCommentFormCard'
import * as TicketHistoriesTable from '@/features/Ticket/Id/ui/TicketHistoriesTable/TicketHistoriesTable'
import {
  type GetTicketDetailResponse,
  type GetTicketHistoryResponseItem,
} from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'
import { type AccountType } from '@/models/constants/accountType'

const mockTicketStatusType: TicketStatusType = 'start'
const mockGetTicketHistoryResponseItem: GetTicketHistoryResponseItem[] = [
  {
    id: 1,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴1',
    created_at: '2025-011-01',
  },
  {
    id: 2,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴2',
    created_at: '2025-011-01',
  },
]
const mockGetTicketDetailResponse: GetTicketDetailResponse = {
  id: 1,
  title: 'テストタイトル',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  supporter: 'テストサポート担当者1',
  created_at: '2025-11-01T00:00:00Z',
  is_own_ticket: true,
  ticket_histories: mockGetTicketHistoryResponseItem,
}
const mockUserAccountType: AccountType = 'supporter'
const mockHandleAssignSupporter = vi.fn()
const mockHandleUnassignSupporter = vi.fn()
const mockHandleUpdateTicketStatus = vi.fn()
const mockHandleCreateTicketComment = vi.fn()
const mockHandleUpdateTicketVisibility = vi.fn()
const defaultProps = {
  ticketData: mockGetTicketDetailResponse,
  userAccountType: mockUserAccountType,
  handleAssignSupporter: mockHandleAssignSupporter,
  handleUnassignSupporter: mockHandleUnassignSupporter,
  handleUpdateTicketStatus: mockHandleUpdateTicketStatus,
  handleCreateTicketComment: mockHandleCreateTicketComment,
  handleUpdateTicketVisibility: mockHandleUpdateTicketVisibility,
}

const mockUserAccountTypeIsSupporter: AccountType = 'supporter'
const noSupporterProps = {
  ...defaultProps,
  ticketData: {
    ...defaultProps.ticketData,
    supporter: null,
  },
  userAccountType: mockUserAccountTypeIsSupporter,
}

const privateTicketProps = {
  ...defaultProps,
  ticketData: { ...defaultProps.ticketData, is_public: false },
}

const notOwnTicketProps = {
  ...defaultProps,
  ticketData: { ...defaultProps.ticketData, is_own_ticket: false },
}

const ticketDetails = [
  'ID：1',
  '質問日',
  '2025 / 11 / 01',
  '公開設定',
  '公開',
  '非公開',
  'タイトル',
  'テストタイトル',
  '詳細',
  'テスト詳細',
  'ステータス',
  '新規質問',
  '担当割り当て済み',
  '対応中',
  '解決済み',
  'クローズ',
]

// Mocking the Header component
const mockHeader = vi.spyOn(Header, 'Header').mockImplementation(() => {
  return <div data-testid='mock-header'>Mocked Header</div>
})

// Mocking the CreateTicketCommentFormCard component
const mockCreateTicketCommentFormCard = vi
  .spyOn(CreateTicketCommentFormCard, 'CreateTicketCommentFormCard')
  .mockImplementation(() => {
    return (
      <div data-testid='mock-createTicketCommentFormCard'>Mocked CreateTicketCommentFormCard</div>
    )
  })

// Mocking the TicketHistoriesTable component
const mockTicketHistoriesTable = vi
  .spyOn(TicketHistoriesTable, 'TicketHistoriesTable')
  .mockImplementation(() => {
    return <div data-testid='mock-ticketHistoriesTable'>Mocked TicketHistoriesTable</div>
  })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TicketIdPresentational', () => {
  describe('正常系', () => {
    it('正しいpropsでHeaderコンポーネントが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
      expect(mockHeader.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
        }),
      )
    })

    it('正しいpropsでCreateTicketCommentFormCardコンポーネントが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-createTicketCommentFormCard')).toBeInTheDocument()
      expect(mockCreateTicketCommentFormCard.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          handleCreateTicketComment: mockHandleCreateTicketComment,
        }),
      )
    })

    it('正しいpropsでTicketHistoriesTableコンポーネントが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-ticketHistoriesTable')).toBeInTheDocument()
      expect(mockTicketHistoriesTable.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          ticketHistories: mockGetTicketHistoryResponseItem,
        }),
      )
    })

    it('表示されるべきテキストやデータが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      ticketDetails.forEach((ticketDetail) => {
        expect(screen.getByText(ticketDetail)).toBeInTheDocument()
      })
    })

    it('チケットのサポート担当者が設定されている場合、「担当者になる」ボタンは表示されない', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.queryByRole('button', { name: '担当者になる' })).not.toBeInTheDocument()
    })

    it('チケットのサポート担当者が未設定であり、ログインしているアカウントタイプがサポート担当者の場合、「担当者になる」ボタンが表示される', () => {
      customRender(<TicketIdPresentational {...noSupporterProps} />)

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeInTheDocument()
    })

    it('「担当者になる」ボタンを押下すると handleAssignSupporter が呼ばれる', async () => {
      customRender(<TicketIdPresentational {...noSupporterProps} />)

      await userEvent.click(screen.getByRole('button', { name: '担当者になる' }))

      expect(mockHandleAssignSupporter).toHaveBeenCalledTimes(1)
    })

    it('ログインしているアカウントがチケットのサポート担当者でない場合、「担当を離れる」ボタンは表示されない', () => {
      customRender(<TicketIdPresentational {...notOwnTicketProps} />)

      expect(screen.queryByRole('button', { name: '担当を離れる' })).not.toBeInTheDocument()
    })

    it('ログインしているアカウントがチケットのサポート担当者である場合、「担当を離れる」ボタンが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByRole('button', { name: '担当を離れる' })).toBeInTheDocument()
    })

    it('「担当を離れる」ボタンを押下すると handleUnassignSupporter が呼ばれる', async () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', { name: '担当を離れる' }))

      expect(mockHandleUnassignSupporter).toHaveBeenCalledTimes(1)
    })

    it('ticketData.is_public の場合、公開設定の「公開」がアクティブになる', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      // .toHaveAttribute → DOM要素が特定の属性を持っているか、その値が期待どおりかを検証
      expect(screen.getByTestId('public-box')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('private-box')).toHaveAttribute('data-active', 'false')
    })

    it('!ticketData.is_public の場合、公開設定の「非公開」がアクティブになる', () => {
      customRender(<TicketIdPresentational {...privateTicketProps} />)

      expect(screen.getByTestId('public-box')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('private-box')).toHaveAttribute('data-active', 'true')
    })

    it('「公開」ボタンを押下すると、handleUpdateTicketVisibility が呼ばれる', async () => {
      customRender(<TicketIdPresentational {...privateTicketProps} />)

      await userEvent.click(screen.getByRole('button', { name: '公開' }))

      expect(mockHandleUpdateTicketVisibility).toHaveBeenCalledTimes(1)
    })

    it('「非公開」ボタンを押下すると、handleUpdateTicketVisibility が呼ばれる', async () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', { name: '非公開' }))

      expect(mockHandleUpdateTicketVisibility).toHaveBeenCalledTimes(1)
    })

    it('ticketData.status に対応するステータスだけがアクティブになる', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByTestId('status-start')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('status-assigned')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-in_progress')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-resolved')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-closed')).toHaveAttribute('data-active', 'false')
    })

    it('チケットのサポート担当/管理者アカウントの場合、ステータスボタンを押下すると、handleUpdateTicketStatus が呼ばれる', async () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', { name: '対応中' }))

      expect(mockHandleUpdateTicketStatus).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('button', { name: '対応中' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: '対応中' })).toHaveStyle('cursor: pointer')
    })

    it('チケットのサポート担当/管理者以外のアカウントの場合、ステータスボタンは disabled で押下しても handleUpdateTicketStatus は呼ばれない', async () => {
      customRender(<TicketIdPresentational {...notOwnTicketProps} />)

      await userEvent.click(screen.getByRole('button', { name: '対応中' }))

      expect(mockHandleUpdateTicketStatus).toHaveBeenCalledTimes(0)
      expect(screen.getByRole('button', { name: '対応中' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '対応中' })).toHaveStyle('cursor: not-allowed')
    })
  })
})
