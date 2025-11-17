import { describe, it, expect, vi } from 'vitest'

import * as client from '../client'
import {
  getTickets,
  getTicket,
  createTicket,
  assignSupporter,
} from '@/services/internal/backend/v1/ticket'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'
import {
  type GetTicketResponseItem,
  type GetTicketHistoryResponseItem,
  type GetTicketDetailResponse,
  type CreateTicketResponse,
  type UpdateTicketResponse,
} from '@/models/api/internal/backend/v1/response/ticket'
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
  title: 'テストチケット1',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  supporter: 'テストサポート担当者2',
  created_at: '2025-011-01',
  ticket_histories: mockGetTicketHistoryResponseItem,
}

const mockCreateTicketRequest: CreateTicketRequest = {
  title: 'テストタイトル',
  is_public: true,
  description: 'テスト詳細',
}

const mockCreateTicketResponse: CreateTicketResponse = {
  id: 1,
  title: 'テストタイトル',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  staff: 1,
  created_at: '2025-011-01',
}

const mockTicketStatusTypeAssigned: TicketStatusType = 'assigned'
const mockUpdateTicketResponse: UpdateTicketResponse = {
  id: 1,
  status: mockTicketStatusTypeAssigned,
  supporter: 'テストサポート担当者2',
}

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

// チケット詳細取得
describe('getTicket', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockGetTicketDetailResponse })

      const result = await getTicket(1)

      expect(mockClientGet).toHaveBeenCalledTimes(1)
      expect(mockClientGet).toHaveBeenCalledWith('/ticket/1')
      expect(result).toEqual(mockGetTicketDetailResponse)
    })
  })

  describe('異常系', () => {
    it('GETに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('チケット詳細の取得に失敗しました')
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockRejectedValue(mockError)

      await expect(getTicket(1)).rejects.toThrow(mockError)

      expect(mockClientGet).toHaveBeenCalledTimes(1)
      expect(mockClientGet).toHaveBeenCalledWith('/ticket/1')
    })
  })
})

// チケット登録
describe('createTicket', () => {
  describe('正常系', () => {
    it('正しいURL/ボディでPOSTし、dataを返す', async () => {
      const mockClientCreate = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockResolvedValue({ data: mockCreateTicketResponse })

      const result = await createTicket(mockCreateTicketRequest)

      expect(mockClientCreate).toHaveBeenCalledTimes(1)
      expect(mockClientCreate).toHaveBeenCalledWith('/ticket', mockCreateTicketRequest)
      expect(result).toEqual(mockCreateTicketResponse)
    })
  })

  describe('異常系', () => {
    it('POSTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('チケットの登録に失敗しました')
      const mockClientCreate = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockRejectedValue(mockError)

      await expect(createTicket(mockCreateTicketRequest)).rejects.toThrow(mockError)

      expect(mockClientCreate).toHaveBeenCalledTimes(1)
    })
  })
})

// チケット更新（サポート担当者登録設定）
describe('assignSupporter', () => {
  describe('正常系', () => {
    it('正しいURLでPUTし、dataを返す', async () => {
      const mockClientUpdate = vi
        .spyOn(client.internalBackendV1Client, 'put')
        .mockResolvedValue({ data: mockUpdateTicketResponse })

      const result = await assignSupporter(1)

      expect(mockClientUpdate).toHaveBeenCalledTimes(1)
      expect(mockClientUpdate).toHaveBeenCalledWith('/ticket/1/assign')
      expect(result).toEqual(mockUpdateTicketResponse)
    })
  })

  describe('異常系', () => {
    it('PUTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('担当の割り当てに失敗しました')
      const mockClientUpdate = vi
        .spyOn(client.internalBackendV1Client, 'put')
        .mockRejectedValue(mockError)

      await expect(assignSupporter(1)).rejects.toThrow(mockError)

      expect(mockClientUpdate).toHaveBeenCalledTimes(1)
    })
  })
})
