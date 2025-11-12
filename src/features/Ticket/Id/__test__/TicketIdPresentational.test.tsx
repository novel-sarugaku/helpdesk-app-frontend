import { describe, it, vi, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { TicketIdPresentational } from '@/features/Ticket/Id/TicketIdPresentational'
import * as Header from '@/components/organisms/Header'
import { type GetTicketDetailResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'
import { type AccountType } from '@/models/constants/accountType'

const mockTicketStatusType: TicketStatusType = 'start'
const mockGetTicketDetailResponse: GetTicketDetailResponse = {
  id: 1,
  title: 'テストタイトル',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  supporter: 'テストサポート担当者1',
  created_at: '2025-11-01T00:00:00Z',
}
const mockUserAccountType: AccountType = 'staff'
const defaultProps = {
  ticketData: mockGetTicketDetailResponse,
  userAccountType: mockUserAccountType,
}

const privateTicketProps = {
  ...defaultProps,
  ticketData: { ...defaultProps.ticketData, is_public: false },
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

    it('表示されるべきテキストやデータが表示される', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      ticketDetails.forEach((ticketDetail) => {
        expect(screen.getByText(ticketDetail)).toBeInTheDocument()
      })
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

    it('ticketData.status に対応するステータスだけがアクティブになる', () => {
      customRender(<TicketIdPresentational {...defaultProps} />)

      expect(screen.getByTestId('status-start')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('status-assigned')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-in_progress')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-resolved')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('status-closed')).toHaveAttribute('data-active', 'false')
    })
  })
})
