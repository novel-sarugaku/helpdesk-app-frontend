import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useTicketDetailQuery } from '@/features/Ticket/Id/hooks/queries/useTicketDetailQuery'
import * as tickets from '@/services/internal/backend/v1/ticket'
import {
  type GetTicketDetailResponse,
  type GetTicketHistoryResponseItem,
} from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockTicketId = 1
const mockTicketStatusType: TicketStatusType = 'start'
const mockGetTicketHistoryResponseItem: GetTicketHistoryResponseItem[] = [
  {
    id: 1,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴1',
    created_at: '2025-11-01',
  },
  {
    id: 2,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴2',
    created_at: '2025-11-02',
  },
]
const mockGetTicketDetailResponse: GetTicketDetailResponse = {
  id: 1,
  title: 'テストチケット1',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  supporter: 'テストサポート担当者2',
  created_at: '2025-011-01',
  is_own_ticket: true,
  ticket_histories: mockGetTicketHistoryResponseItem,
}

describe('useTicketDetailQuery', () => {
  describe('正常系', () => {
    it('チケット詳細取得API呼び出しに成功した場合、正しいレスポンスを返す(ticket_histories の created_at は降順)を返す', async () => {
      vi.spyOn(tickets, 'getTicket').mockResolvedValue(mockGetTicketDetailResponse)

      const { result } = customRenderHook(() => useTicketDetailQuery(mockTicketId))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(tickets.getTicket).toHaveBeenCalledTimes(1)
      expect(tickets.getTicket).toHaveBeenCalledWith(mockTicketId)
      expect(result.current.data).toEqual({
        id: 1,
        title: 'テストチケット1',
        is_public: true,
        status: mockTicketStatusType,
        description: 'テスト詳細',
        supporter: 'テストサポート担当者2',
        created_at: '2025-011-01',
        is_own_ticket: true,
        ticket_histories: [
          {
            id: 2,
            ticket: 1,
            action_user: 'テスト社員1',
            action_description: 'テスト対応履歴2',
            created_at: '2025-11-02',
          },
          {
            id: 1,
            ticket: 1,
            action_user: 'テスト社員1',
            action_description: 'テスト対応履歴1',
            created_at: '2025-11-01',
          },
        ],
      })
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  describe('異常系', () => {
    it('チケット詳細取得API呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('失敗しました')
      vi.spyOn(tickets, 'getTicket').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useTicketDetailQuery(mockTicketId))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(tickets.getTicket).toHaveBeenCalledTimes(1)
      expect(tickets.getTicket).toHaveBeenCalledWith(mockTicketId)
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('失敗しました')
    })
  })
})
