import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUnassignSupporterMutation } from '@/features/Ticket/Id/hooks/mutations/useUnassignSupporterMutation'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import * as unassignSupporterService from '@/services/internal/backend/v1/ticket'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockTicketId = 1
const mockTicketStatusTypeUnassigned: TicketStatusType = 'start'
const mockUpdateTicketUnassignSupporterResponse: UpdateTicketResponse = {
  id: mockTicketId,
  status: mockTicketStatusTypeUnassigned,
  supporter: null,
}

describe('useUnassignSupporterMutation', () => {
  describe('正常系', () => {
    it('チケット更新（サポート担当者解除設定）APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(unassignSupporterService, 'unassignSupporter').mockResolvedValue(
        mockUpdateTicketUnassignSupporterResponse,
      )

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUnassignSupporterMutation = useUnassignSupporterMutation(mockTicketId)
        return { mockQueryClient, mockUnassignSupporterMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockUnassignSupporterMutation.mutate()
      })

      await waitFor(() => {
        expect(result.current.mockUnassignSupporterMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockUnassignSupporterMutation.data).toEqual(
        mockUpdateTicketUnassignSupporterResponse,
      )
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Ticket.detail(mockTicketId),
      })
    })
  })

  describe('異常系', () => {
    it('チケット更新（サポート担当者解除設定）APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('担当の解除に失敗しました')

      vi.spyOn(unassignSupporterService, 'unassignSupporter').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useUnassignSupporterMutation(mockTicketId))

      act(() => {
        result.current.mutate()
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('担当の解除に失敗しました')
    })
  })
})
