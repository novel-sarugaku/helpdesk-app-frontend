import { act } from 'react'
import { toaster } from '@/components/ui/toaster'
import { describe, it, vi, expect } from 'vitest'
import { type AxiosError } from 'axios'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useAssignSupporterHandler } from '@/features/Ticket/Id/hooks/handlers/useAssignSupporterHandler'
import * as useAssignSupporterMutation from '@/features/Ticket/Id/hooks/mutations/useAssignSupporterMutation'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// Mocking the useAssignSupporterMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useAssignSupporterMutation, 'useAssignSupporterMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<UpdateTicketResponse, Error, void>)

// Mocking the toaster
const createSuccessMessage = '担当者を割り当てました'
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockTicketId = 1

describe('useAssignSupporterHandler', () => {
  describe('正常系', () => {
    it('チケット更新（サポート担当者登録）に成功した場合、成功メッセージでトーストを作成する', async () => {
      const { result } = customRenderHook(() => useAssignSupporterHandler(mockTicketId))

      await act(() => result.current.handleAssignSupporter())

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: createSuccessMessage,
        type: 'success',
      })
    })

    it('チケット更新（サポート担当者登録）に失敗し、response.data.detail が存在する場合、その内容でトーストを作成する', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'システムエラーが発生しました' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useAssignSupporterMutation, 'useAssignSupporterMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateTicketResponse, Error, void>)

      const { result } = customRenderHook(() => useAssignSupporterHandler(mockTicketId))

      await act(() => result.current.handleAssignSupporter())

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: 'システムエラーが発生しました',
        type: 'error',
      })
    })

    it('チケット更新（サポート担当者登録）に失敗し、response.data.detail が存在しない場合、汎用的なメッセージ（「通信エラーが発生しました」）でトーストを作成する', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useAssignSupporterMutation, 'useAssignSupporterMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateTicketResponse, Error, void>)

      const { result } = customRenderHook(() => useAssignSupporterHandler(mockTicketId))

      await act(() => result.current.handleAssignSupporter())

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '通信エラーが発生しました',
        type: 'error',
      })
    })
  })
})
