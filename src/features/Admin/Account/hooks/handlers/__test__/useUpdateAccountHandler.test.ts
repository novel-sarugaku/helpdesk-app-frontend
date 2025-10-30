import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { toaster } from '@/components/ui/toaster'
import { type UseMutationResult } from '@tanstack/react-query'
import { type AxiosError } from 'axios'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateAccountHandler } from '@/features/Admin/Account/hooks/handlers/useUpdateAccountHandler'
import * as useUpdateAccountMutation from '@/features/Admin/Account/hooks/mutations/useUpdateAccountMutation'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type UpdateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type UpdateAccountResponse } from '@/models/api/internal/backend/v1/response/account'

// Mocking the useUpdateAccountMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useUpdateAccountMutation, 'useUpdateAccountMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<UpdateAccountResponse, Error, UpdateAccountRequest>)

// Mocking the toaster
const createSuccessMessage = 'アカウント利用状態の更新が完了しました'
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

const mockUserAccountType: AccountType = 'staff'
const mockGetAccountResponseItem: GetAccountResponseItem = {
  id: 1,
  name: 'テストユーザー1',
  email: 'tes1@example.com',
  account_type: mockUserAccountType,
  is_suspended: false,
}

const mockUpdateAccountRequest: UpdateAccountRequest = {
  id: 1,
  is_suspended: true,
}

describe('useUpdateAccountHandler', () => {
  describe('正常系', () => {
    it('登録成功時、正しいリクエストを送信し、成功トースト（「アカウント利用状態の更新が完了しました」）を作成する', async () => {
      const { result } = customRenderHook(() => useUpdateAccountHandler())

      await act(() => result.current.changeAccountStatus(mockGetAccountResponseItem))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockUpdateAccountRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: createSuccessMessage,
        type: 'success',
      })
    })
  })

  describe('準正常系', () => {
    it('登録失敗時、response.data.detail が存在する場合、その内容で失敗トーストを作成する', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'システムエラーが発生しました' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useUpdateAccountMutation, 'useUpdateAccountMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateAccountResponse, Error, UpdateAccountRequest>)

      const { result } = customRenderHook(() => useUpdateAccountHandler())

      await act(() => result.current.changeAccountStatus(mockGetAccountResponseItem))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockUpdateAccountRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: 'システムエラーが発生しました',
        type: 'error',
      })
    })
  })

  describe('異常系', () => {
    it('登録失敗時、response.data.detail が存在しない場合、汎用的なメッセージ（「通信エラーが発生しました」）で失敗トーストを作成する', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useUpdateAccountMutation, 'useUpdateAccountMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<UpdateAccountResponse, Error, UpdateAccountRequest>)

      const { result } = customRenderHook(() => useUpdateAccountHandler())

      await act(() => result.current.changeAccountStatus(mockGetAccountResponseItem))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockUpdateAccountRequest)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '通信エラーが発生しました',
        type: 'error',
      })
    })
  })
})
