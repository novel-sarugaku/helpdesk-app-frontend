import { act } from 'react'
import { type AxiosError } from 'axios'
import { describe, it, vi, expect } from 'vitest'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateAccountDialogHandler } from '@/features/Admin/Account/hooks/handlers/useCreateAccountDialogHandler'
import * as useCreateAccountMutation from '@/features/Admin/Account/hooks/mutations/useCreateAccountMutation'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type CreateAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

// Mocking the useCreateAccountMutation hook
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()
vi.spyOn(useCreateAccountMutation, 'useCreateAccountMutation').mockReturnValue({
  mutate: mockMutate,
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<CreateAccountResponse, Error, CreateAccountRequest>)

const mockName = 'テストユーザー3'
const mockEmail = 'tes3@example.com'
const mockPassword = 'testPass123'
const mockAccountType: AccountType = 'staff'
const mockCreateAccountRequest: CreateAccountRequest = {
  name: mockName,
  email: mockEmail,
  password: mockPassword,
  account_type: mockAccountType,
}

describe('useCreateAccountDialogHandler', () => {
  describe('正常系', () => {
    it('formError の初期値は null である', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      expect(result.current.formError).toBeNull()
    })

    it('isDialogOpen の初期値は false である', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      expect(result.current.isDialogOpen).toBe(false)
    })

    it('onDialogOpenChange が true のときは isDialogOpen が true になる、onDialogOpenChange が false のときは isDialogOpen が false になる', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      act(() => {
        result.current.onDialogOpenChange(false)
      })

      expect(result.current.isDialogOpen).toBe(false)
    })

    it('ダイアログを閉じると formError が null になる', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.setFormError('ダミーエラー')
      })

      expect(result.current.formError).toBe('ダミーエラー')

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)
      expect(result.current.formError).toBe('ダミーエラー')

      act(() => {
        result.current.onDialogOpenChange(false)
      })

      expect(result.current.formError).toBeNull()
      expect(result.current.isDialogOpen).toBe(false)
    })

    it('登録に成功した場合、ダイアログを閉じ、formError が null になる', async () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateAccount(mockCreateAccountRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateAccountRequest)
      expect(result.current.isDialogOpen).toBe(false)
      expect(result.current.formError).toBeNull()
    })

    it('登録に失敗し、response.data.detail が存在する場合 formError 内容をセットし、ダイアログは閉じない', async () => {
      const mockAxiosError = {
        isAxiosError: true, // error.isAxiosError === true にする
        // error.response.data.detail をセット
        response: {
          data: { detail: 'すでに存在するメールアドレスです' },
        },
      } as AxiosError
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockAxiosError)
      vi.spyOn(useCreateAccountMutation, 'useCreateAccountMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<CreateAccountResponse, Error, CreateAccountRequest>)

      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateAccount(mockCreateAccountRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateAccountRequest)
      expect(result.current.formError).toBe('すでに存在するメールアドレスです')
      expect(result.current.isDialogOpen).toBe(true)
    })

    it('登録に失敗し、response.data.detail が存在しない場合 formError に汎用的なメッセージ（「通信エラーが発生しました」）をセットし、ダイアログは閉じない', async () => {
      const mockError = new Error('エラー発生')
      const mockMutate = vi.fn()
      const mockMutateAsync = vi.fn().mockRejectedValue(mockError)
      vi.spyOn(useCreateAccountMutation, 'useCreateAccountMutation').mockReturnValue({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
      } as unknown as UseMutationResult<CreateAccountResponse, Error, CreateAccountRequest>)

      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.onDialogOpenChange(true)
      })

      expect(result.current.isDialogOpen).toBe(true)

      await act(() => result.current.handleCreateAccount(mockCreateAccountRequest))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockCreateAccountRequest)
      expect(result.current.formError).toBe('通信エラーが発生しました')
      expect(result.current.isDialogOpen).toBe(true)
    })
  })
})
