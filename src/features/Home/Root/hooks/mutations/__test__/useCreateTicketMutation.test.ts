import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateTicketMutation } from '@/features/Home/Root/hooks/mutations/useCreateTicketMutation'
import { Tickets } from '@/features/Home/Root/hooks/queries/queryKeys'
import * as createTicketService from '@/services/internal/backend/v1/ticket'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockCreateTicketRequest: CreateTicketRequest = {
  title: 'テストタイトル',
  is_public: true,
  description: 'テスト詳細',
}
const mockTicketStatusType: TicketStatusType = 'start'
const mockCreateTicketResponse: CreateTicketResponse = {
  id: 1,
  title: 'テストタイトル',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  staff: 1,
  created_at: '2025-011-01',
}

describe('useCreateTicketMutation', () => {
  describe('正常系', () => {
    it('チケット登録APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(createTicketService, 'createTicket').mockResolvedValue(mockCreateTicketResponse)

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockCreateTicketMutation = useCreateTicketMutation()
        return { mockQueryClient, mockCreateTicketMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockCreateTicketMutation.mutate(mockCreateTicketRequest)
      })

      await waitFor(() => {
        expect(result.current.mockCreateTicketMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockCreateTicketMutation.data).toEqual(mockCreateTicketResponse)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Tickets.all,
      })
    })
  })

  describe('異常系', () => {
    it('チケット登録APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('チケット登録に失敗しました')

      vi.spyOn(createTicketService, 'createTicket').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useCreateTicketMutation())

      act(() => {
        result.current.mutate(mockCreateTicketRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('チケット登録に失敗しました')
    })
  })
})
