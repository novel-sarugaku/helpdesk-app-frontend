import { describe, it, vi, expect } from 'vitest'
import { act } from 'react'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateAccountDialogHandler } from '@/features/Admin/Account/hooks/handlers/useCreateAccountDialogHandler'
import * as useCreateAccountMutation from '@/features/Admin/Account/hooks/mutations/useCreateAccountMutation'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type CreateAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

// Mocking the useCreateAccountMutation hook
const mockMutate = vi.fn()
vi.spyOn(useCreateAccountMutation, 'useCreateAccountMutation').mockReturnValue({
  mutate: mockMutate,
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
    it('emailError の初期値は null である', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      expect(result.current.emailError).toBeNull()
    })

    it('setEmailError でエラーメッセージを設定および解除できる', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.setEmailError('このメールアドレスは既に使用されています')
      })

      expect(result.current.emailError).toBe('このメールアドレスは既に使用されています')

      act(() => {
        result.current.setEmailError(null)
      })

      expect(result.current.emailError).toBeNull()
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

    it('handleCreateAccount が呼ばれたとき、mutate に正しいリクエストが渡され、登録後に isDialogOpenがfalse になる', () => {
      const { result } = customRenderHook(() => useCreateAccountDialogHandler())

      act(() => {
        result.current.handleCreateAccount(mockCreateAccountRequest)
      })

      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith(mockCreateAccountRequest)

      expect(result.current.isDialogOpen).toBe(false)
    })
  })
})
