import { act } from 'react'
import { toaster } from '@/components/ui/toaster'
import { describe, it, vi, expect } from 'vitest'
import { type AxiosError } from 'axios'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateTicketCommentFormCardHandler } from '@/features/Ticket/Id/hooks/handlers/useCreateTicketCommentFormCardHandler'
import * as useCreateTicketCommentMutation from '@/features/Ticket/Id/hooks/mutations/useCreateTicketCommentMutation'
import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketCommentResponse } from '@/models/api/internal/backend/v1/response/ticket'

// Mocking the useCreateTicketCommentMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useCreateTicketCommentMutation, 'useCreateTicketCommentMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<CreateTicketCommentResponse, Error, CreateTicketCommentRequest>)

// Mocking the toaster
const createSuccessMessage = 'ID:1 質疑応答を送信しました'
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockTicketId = 1
const mockCreateTicketCommentRequest: CreateTicketCommentRequest = {
  comment: 'テスト質疑応答',
}

describe('useCreateTicketCommentFormCardHandler', () => {
  describe('正常系', () => {
    it('チケットに対する質疑応答の登録に成功した場合、成功メッセージでトーストを作成する', async () => {
      const { result } = customRenderHook(() => useCreateTicketCommentFormCardHandler(mockTicketId))

      await act(() => result.current.handleCreateTicketComment(mockCreateTicketCommentRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketCommentRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: createSuccessMessage,
        type: 'success',
      })
    })

    it('チケットに対する質疑応答の登録に失敗し、response.data.detail が存在する場合、その内容でトーストを作成する', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'システムエラーが発生しました' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useCreateTicketCommentMutation, 'useCreateTicketCommentMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<
        CreateTicketCommentResponse,
        Error,
        CreateTicketCommentRequest
      >)

      const { result } = customRenderHook(() => useCreateTicketCommentFormCardHandler(mockTicketId))

      await act(async () => {
        try {
          await result.current.handleCreateTicketComment(mockCreateTicketCommentRequest)
        } catch (error) {
          expect(error).toBe(mockAxiosError)
        }
      })

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketCommentRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: 'システムエラーが発生しました',
        type: 'error',
      })
    })

    it('チケットに対する質疑応答の登録に失敗し、response.data.detail が存在しない場合、汎用的なメッセージ（「通信エラーが発生しました」）でトーストを作成する', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useCreateTicketCommentMutation, 'useCreateTicketCommentMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<
        CreateTicketCommentResponse,
        Error,
        CreateTicketCommentRequest
      >)

      const { result } = customRenderHook(() => useCreateTicketCommentFormCardHandler(mockTicketId))

      await act(async () => {
        try {
          await result.current.handleCreateTicketComment(mockCreateTicketCommentRequest)
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketCommentRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '通信エラーが発生しました',
        type: 'error',
      })
    })
  })
})
