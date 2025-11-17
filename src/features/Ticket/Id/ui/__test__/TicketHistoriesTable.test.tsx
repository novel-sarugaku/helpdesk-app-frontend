import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { TicketHistoriesTable } from '@/features/Ticket/Id/ui/TicketHistoriesTable'
import { type GetTicketHistoryResponseItem } from '@/models/api/internal/backend/v1/response/ticket'

const mockGetTicketHistoryResponseItem: GetTicketHistoryResponseItem[] = [
  {
    id: 1,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴1',
    created_at: '2025-11-01T00:00:00',
  },
  {
    id: 2,
    ticket: 1,
    action_user: 'テストサポーター1',
    action_description: 'テスト対応履歴2',
    created_at: '2025-11-02T00:00:00',
  },
]

const defaultProps = {
  ticketHistories: mockGetTicketHistoryResponseItem,
}

const mockTicketHistoriesWithSystemUser: GetTicketHistoryResponseItem[] = [
  {
    id: 1,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴1',
    created_at: '2025-11-01T00:00:00',
  },
  {
    id: 2,
    ticket: 1,
    action_user: null,
    action_description: 'テスト担当割り当て',
    created_at: '2025-11-02T00:00:00',
  },
]
const ticketHistoriesWithSystemUserProps = {
  ticketHistories: mockTicketHistoriesWithSystemUser,
}

const noTicketHistoryProps = {
  ticketHistories: [],
}

//  \s+ → 改行も含めた空白
const ticketHistoriesData = [
  /2025 11 01\s+00：00：00/,
  'テスト社員1',
  'テスト対応履歴1',
  /2025 11 02\s+00：00：00/,
  'テストサポーター1',
  'テスト対応履歴2',
]

const ticketHistoriesWithSystemUserData = [
  /2025 11 01\s+00：00：00/,
  'テスト社員1',
  'テスト対応履歴1',
  /2025 11 02\s+00：00：00/,
  'system',
  'テスト担当割り当て',
]

describe('TicketHistoriesTable', () => {
  describe('正常系', () => {
    it('対応履歴が存在する場合、表示されるべきテキストやデータが表示される', () => {
      customRender(<TicketHistoriesTable {...defaultProps} />)

      ticketHistoriesData.forEach((ticketHistoryData) => {
        expect(screen.getByText(ticketHistoryData)).toBeInTheDocument()
      })
    })

    it('対応履歴が存在していて、action_user が null の場合、表示されるべきテキストやデータ（対応者はsystem）が表示される', () => {
      customRender(<TicketHistoriesTable {...ticketHistoriesWithSystemUserProps} />)

      ticketHistoriesWithSystemUserData.forEach((ticketHistoryData) => {
        expect(screen.getByText(ticketHistoryData)).toBeInTheDocument()
      })
    })

    it('対応履歴が存在しない場合、「対応履歴はありません」が表示される', () => {
      customRender(<TicketHistoriesTable {...noTicketHistoryProps} />)

      expect(screen.getByText('対応履歴はありません')).toBeInTheDocument()
    })
  })
})
