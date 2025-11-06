import { describe, it, expect, vi } from 'vitest'

import * as client from '../client'
import { getTickets } from '@/services/internal/backend/v1/ticket'
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
    created_at: '2025-011-01',
  },
  {
    id: 2,
    title: 'テストチケット2',
    is_public: true,
    status: mockTicketStatusType,
    staff: 'テスト社員2',
    supporter: 'テストサポート担当者2',
    created_at: '2025-011-01',
  },
]

// チケット全件取得
describe('getTickets', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockGetTicketResponse })

      const result = await getTickets()

      expect(mockClientGet).toHaveBeenCalledTimes(1)
      expect(mockClientGet).toHaveBeenCalledWith('/ticket')
      expect(result).toEqual(mockGetTicketResponse)
    })
  })

  describe('異常系', () => {
    it('GETに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('チケットの取得に失敗しました')
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockRejectedValue(mockError)

      await expect(getTickets()).rejects.toThrow(mockError)

      expect(mockClientGet).toHaveBeenCalledTimes(1)
    })
  })
})
