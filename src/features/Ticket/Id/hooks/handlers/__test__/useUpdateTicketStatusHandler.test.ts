import { act } from 'react'
import { toaster } from '@/components/ui/toaster'
import { describe, it, vi, expect } from 'vitest'
import { type AxiosError } from 'axios'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateTicketStatusHandler } from '@/features/Ticket/Id/hooks/handlers/useUpdateTicketStatusHandler'
import * as useUpdateTicketStatusMutation from '@/features/Ticket/Id/hooks/mutations/useUpdateTicketStatusMutation'
import { type UpdateTicketStatusRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type UpdateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

// Mocking the useUpdateTicketStatusMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useUpdateTicketStatusMutation, 'useUpdateTicketStatusMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<UpdateTicketResponse, Error, UpdateTicketStatusRequest>)

// Mocking the toaster
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockTicketId = 1
const mockNewStatus: TicketStatusType = 'assigned'
const mockUpdateTicketStatusRequest: UpdateTicketStatusRequest = {
  status: mockNewStatus,
}

describe('useUpdateTicketStatusHandler', () => {
  describe('正常系', () => {
    it('チケット更新（ステータス変更）に成功する', async () => {
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(mockTicketId))

      await act(() => result.current.handleUpdateTicketStatus(mockNewStatus))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockUpdateTicketStatusRequest)
    })

    it('チケット更新（ステータス変更）に失敗し、response.data.detail が存在する場合、その内容でトーストを作成する', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'システムエラーが発生しました' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useUpdateTicketStatusMutation, 'useUpdateTicketStatusMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateTicketResponse, Error, UpdateTicketStatusRequest>)

      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(mockTicketId))

      await act(() => result.current.handleUpdateTicketStatus(mockNewStatus))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: 'システムエラーが発生しました',
        type: 'error',
      })
    })

    it('チケット更新（ステータス変更）に失敗し、response.data.detail が存在しない場合、汎用的なメッセージ（「通信エラーが発生しました」）でトーストを作成する', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useUpdateTicketStatusMutation, 'useUpdateTicketStatusMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateTicketResponse, Error, UpdateTicketStatusRequest>)

      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(mockTicketId))

      await act(() => result.current.handleUpdateTicketStatus(mockNewStatus))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '通信エラーが発生しました',
        type: 'error',
      })
    })
  })
})
