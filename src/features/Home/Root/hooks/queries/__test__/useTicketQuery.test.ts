import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useTicketQuery } from '@/features/Home/Root/hooks/queries/useTicketQuery'
import * as tickets from '@/services/internal/backend/v1/ticket'
import { type GetTicketResponseItem } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockTicketStatusType: TicketStatusType = 'start'
const mockGetTicketResponse: GetTicketResponseItem[] = [
  {
    id: 1,
    title: 'テストチケット1',
    is_public: true,
    status: mockTicketStatusType,
    staff: 'テスト社員1',
    supporter: 'テストサポート担当者1',
    created_at: '2025-11-02T00:00:00Z',
  },
  {
    id: 2,
    title: 'テストチケット2',
    is_public: true,
    status: mockTicketStatusType,
    staff: 'テスト社員2',
    supporter: 'テストサポート担当者2',
    created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: 3,
    title: 'テストチケット3',
    is_public: true,
    status: mockTicketStatusType,
    staff: 'テスト社員3',
    supporter: 'テストサポート担当者3',
    created_at: '2025-11-04T00:00:00Z',
  },
  {
    id: 4,
    title: 'テストチケット4',
    is_public: true,
    status: mockTicketStatusType,
    staff: 'テスト社員4',
    supporter: 'テストサポート担当者4',
    created_at: '2025-11-03T00:00:00Z',
  },
]

describe('useTicketQuery', () => {
  describe('正常系', () => {
    it('チケット取得API呼び出しに成功した場合、正しいレスポンス(created_atは降順)を返す', async () => {
      vi.spyOn(tickets, 'getTickets').mockResolvedValue(mockGetTicketResponse)

      const { result } = customRenderHook(() => useTicketQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(tickets.getTickets).toHaveBeenCalledTimes(1)
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toEqual([
        {
          id: 3,
          title: 'テストチケット3',
          is_public: true,
          status: mockTicketStatusType,
          staff: 'テスト社員3',
          supporter: 'テストサポート担当者3',
          created_at: '2025-11-04T00:00:00Z',
        },
        {
          id: 4,
          title: 'テストチケット4',
          is_public: true,
          status: mockTicketStatusType,
          staff: 'テスト社員4',
          supporter: 'テストサポート担当者4',
          created_at: '2025-11-03T00:00:00Z',
        },
        {
          id: 1,
          title: 'テストチケット1',
          is_public: true,
          status: mockTicketStatusType,
          staff: 'テスト社員1',
          supporter: 'テストサポート担当者1',
          created_at: '2025-11-02T00:00:00Z',
        },
        {
          id: 2,
          title: 'テストチケット2',
          is_public: true,
          status: mockTicketStatusType,
          staff: 'テスト社員2',
          supporter: 'テストサポート担当者2',
          created_at: '2025-11-01T00:00:00Z',
        },
      ])
    })
  })

  describe('異常系', () => {
    it('チケット取得API呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('失敗しました')
      vi.spyOn(tickets, 'getTickets').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useTicketQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(tickets.getTickets).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('失敗しました')
    })
  })
})
