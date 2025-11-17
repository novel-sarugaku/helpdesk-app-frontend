import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useAssignSupporterMutation } from '@/features/Ticket/Id/hooks/mutations/useAssignSupporterMutation'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import * as assignSupporterService from '@/services/internal/backend/v1/ticket'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

const mockTicketId = 1
const mockTicketStatusTypeAssigned: TicketStatusType = 'assigned'
const mockUpdateTicketResponse: UpdateTicketResponse = {
  id: mockTicketId,
  status: mockTicketStatusTypeAssigned,
  supporter: 'テストサポート担当者2',
}

describe('useAssignSupporterMutation', () => {
  describe('正常系', () => {
    it('チケット更新（サポート担当者登録設定）APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(assignSupporterService, 'assignSupporter').mockResolvedValue(
        mockUpdateTicketResponse,
      )

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockAssignSupporterMutation = useAssignSupporterMutation(mockTicketId)
        return { mockQueryClient, mockAssignSupporterMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockAssignSupporterMutation.mutate()
      })

      await waitFor(() => {
        expect(result.current.mockAssignSupporterMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockAssignSupporterMutation.data).toEqual(mockUpdateTicketResponse)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Ticket.detail(mockTicketId),
      })
    })
  })

  describe('異常系', () => {
    it('チケット更新（サポート担当者登録設定）APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('担当の割り当てに失敗しました')

      vi.spyOn(assignSupporterService, 'assignSupporter').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useAssignSupporterMutation(mockTicketId))

      act(() => {
        result.current.mutate()
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('担当の割り当てに失敗しました')
    })
  })
})
