import { act } from 'react'
import { toaster } from '@/components/ui/toaster'
import { describe, it, vi, expect } from 'vitest'
import { type AxiosError } from 'axios'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateTicketDialogCardHandler } from '@/features/Home/Root/hooks/handlers/useCreateTicketDialogCardHandler'
import * as useCreateTicketMutation from '@/features/Home/Root/hooks/mutations/useCreateTicketMutation'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'
import { type CreateTicketResponse } from '@/models/api/internal/backend/v1/response/ticket'

// Mocking the useCreateTicketMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useCreateTicketMutation, 'useCreateTicketMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<CreateTicketResponse, Error, CreateTicketRequest>)

// Mocking the toaster
const createSuccessMessage = '【チケット：テストタイトル】が登録されました。'
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockTitle = 'テストタイトル'
const mockDescription = 'テスト詳細'
const mockCreateTicketRequest: CreateTicketRequest = {
  title: mockTitle,
  is_public: true,
  description: mockDescription,
}

describe('useCreateTicketDialogCardHandler', () => {
  describe('正常系', () => {
    it('isDialogOpen の初期値は false である', () => {
      const { result } = customRenderHook(() => useCreateTicketDialogCardHandler())

      expect(result.current.isDialogOpen).toBe(false)
    })

    it('onDialogOpenChange が true のときは isDialogOpen が true になる、onDialogOpenChange が false のときは isDialogOpen が false になる', () => {
      const { result } = customRenderHook(() => useCreateTicketDialogCardHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      act(() => {
        result.current.onDialogOpenChange(false)
      })

      expect(result.current.isDialogOpen).toBe(false)
    })

    it('登録に成功した場合、成功メッセージでトーストを作成し、ダイアログを閉じる', async () => {
      const { result } = customRenderHook(() => useCreateTicketDialogCardHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateTicket(mockCreateTicketRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: createSuccessMessage,
        type: 'success',
      })
      expect(result.current.isDialogOpen).toBe(false)
    })

    it('登録に失敗し、response.data.detail が存在する場合、その内容でトーストを作成し、ダイアログは閉じない', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'システムエラーが発生しました' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useCreateTicketMutation, 'useCreateTicketMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<CreateTicketResponse, Error, CreateTicketRequest>)

      const { result } = customRenderHook(() => useCreateTicketDialogCardHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateTicket(mockCreateTicketRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: 'システムエラーが発生しました',
        type: 'error',
      })
      expect(result.current.isDialogOpen).toBe(true)
    })

    it('登録に失敗し、response.data.detail が存在しない場合、汎用的なメッセージ（「通信エラーが発生しました」）でトーストを作成し、ダイアログは閉じない', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useCreateTicketMutation, 'useCreateTicketMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<CreateTicketResponse, Error, CreateTicketRequest>)

      const { result } = customRenderHook(() => useCreateTicketDialogCardHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateTicket(mockCreateTicketRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateTicketRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '通信エラーが発生しました',
        type: 'error',
      })
      expect(result.current.isDialogOpen).toBe(true)
    })
  })
})
