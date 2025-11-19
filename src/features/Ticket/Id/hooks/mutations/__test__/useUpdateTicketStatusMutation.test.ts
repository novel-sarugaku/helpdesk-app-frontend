import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateTicketStatusMutation } from '@/features/Ticket/Id/hooks/mutations/useUpdateTicketStatusMutation'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import * as updateTicketStatusService from '@/services/internal/backend/v1/ticket'
import { type UpdateTicketStatusRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockNewStatus: TicketStatusType = 'assigned'
const mockUpdateTicketStatusRequest: UpdateTicketStatusRequest = {
  status: mockNewStatus,
}

const mockTicketId = 1
const mockUpdateTicketResponse: UpdateTicketResponse = {
  id: mockTicketId,
  status: mockNewStatus,
  supporter: 'テストサポート担当者2',
}

describe('useUpdateTicketStatusMutation', () => {
  describe('正常系', () => {
    it('チケット更新（ステータス変更）APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(updateTicketStatusService, 'updateTicketStatus').mockResolvedValue(
        mockUpdateTicketResponse,
      )

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUpdateTicketStatusMutation = useUpdateTicketStatusMutation(mockTicketId)
        return { mockQueryClient, mockUpdateTicketStatusMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockUpdateTicketStatusMutation.mutate(mockUpdateTicketStatusRequest)
      })

      await waitFor(() => {
        expect(result.current.mockUpdateTicketStatusMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockUpdateTicketStatusMutation.data).toEqual(mockUpdateTicketResponse)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Ticket.detail(mockTicketId),
      })
    })
  })

  describe('異常系', () => {
    it('チケット更新（ステータス変更）APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('チケットのステータス更新に失敗しました')

      vi.spyOn(updateTicketStatusService, 'updateTicketStatus').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useUpdateTicketStatusMutation(mockTicketId))

      act(() => {
        result.current.mutate(mockUpdateTicketStatusRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('チケットのステータス更新に失敗しました')
    })
  })
})
