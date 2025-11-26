import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateTicketVisibilityMutation } from '@/features/Ticket/Id/hooks/mutations/useUpdateTicketVisibilityMutation'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import * as updateTicketVisibilityService from '@/services/internal/backend/v1/ticket'
import { type UpdateTicketVisibilityRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type UpdateTicketVisibilityResponse } from '@/models/api/internal/backend/v1/response/ticket'

const mockUpdateTicketVisibilityRequest: UpdateTicketVisibilityRequest = {
  is_public: false,
}

const mockTicketId = 1
const mockUpdateTicketVisibilityResponse: UpdateTicketVisibilityResponse = {
  id: mockTicketId,
  action_user: 'テスト社員1',
  is_public: false,
}

describe('useUpdateTicketVisibilityMutation', () => {
  describe('正常系', () => {
    it('チケット更新（公開設定変更）APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(updateTicketVisibilityService, 'updateTicketVisibility').mockResolvedValue(
        mockUpdateTicketVisibilityResponse,
      )

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUpdateTicketVisibilityMutation = useUpdateTicketVisibilityMutation(mockTicketId)
        return { mockQueryClient, mockUpdateTicketVisibilityMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockUpdateTicketVisibilityMutation.mutate(mockUpdateTicketVisibilityRequest)
      })

      await waitFor(() => {
        expect(result.current.mockUpdateTicketVisibilityMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockUpdateTicketVisibilityMutation.data).toEqual(
        mockUpdateTicketVisibilityResponse,
      )
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Ticket.detail(mockTicketId),
      })
    })
  })

  describe('異常系', () => {
    it('チケット更新（公開設定変更）APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('チケットの公開設定の更新に失敗しました')

      vi.spyOn(updateTicketVisibilityService, 'updateTicketVisibility').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useUpdateTicketVisibilityMutation(mockTicketId))

      act(() => {
        result.current.mutate(mockUpdateTicketVisibilityRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('チケットの公開設定の更新に失敗しました')
    })
  })
})
