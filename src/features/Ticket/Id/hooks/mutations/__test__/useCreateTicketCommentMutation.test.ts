import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateTicketCommentMutation } from '@/features/Ticket/Id/hooks/mutations/useCreateTicketCommentMutation'
import { Ticket } from '@/features/Ticket/Id/hooks/queries/queryKeys'
import * as createTicketCommentService from '@/services/internal/backend/v1/ticket'
import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketCommentResponse } from '@/models/api/internal/backend/v1/response/ticket'

const mockCreateTicketCommentRequest: CreateTicketCommentRequest = {
  comment: 'テスト質疑応答',
}

const mockTicketId = 1
const mockCreateTicketCommentResponse: CreateTicketCommentResponse = {
  id: mockTicketId,
  action_user: 'テスト社員1',
  comment: 'テスト質疑応答',
}

describe('useCreateTicketCommentMutation', () => {
  describe('正常系', () => {
    it('チケットに対する質疑応答登録APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(createTicketCommentService, 'createTicketComment').mockResolvedValue(
        mockCreateTicketCommentResponse,
      )

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockCreateTicketCommentMutation = useCreateTicketCommentMutation(mockTicketId)
        return { mockQueryClient, mockCreateTicketCommentMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockCreateTicketCommentMutation.mutate(mockCreateTicketCommentRequest)
      })

      await waitFor(() => {
        expect(result.current.mockCreateTicketCommentMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockCreateTicketCommentMutation.data).toEqual(
        mockCreateTicketCommentResponse,
      )
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Ticket.detail(mockTicketId),
      })
    })
  })

  describe('異常系', () => {
    it('チケットに対する質疑応答登録APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('チケットに対する質疑応答の登録に失敗しました')

      vi.spyOn(createTicketCommentService, 'createTicketComment').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useCreateTicketCommentMutation(mockTicketId))

      act(() => {
        result.current.mutate(mockCreateTicketCommentRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('チケットに対する質疑応答の登録に失敗しました')
    })
  })
})
