import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useCreateAccountMutation } from '@/features/Admin/Account/hooks/mutations/useCreateAccountMutation'
import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import * as createAccountService from '@/services/internal/backend/v1/account'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type CreateAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockAccountType: AccountType = 'staff'
const mockCreateAccountRequest: CreateAccountRequest = {
  name: 'テストユーザー1',
  email: 'tes1@example.com',
  password: 'testPass123',
  account_type: mockAccountType,
}

const mockCreateAccountResponse: CreateAccountResponse = {
  id: 1,
  name: 'テストユーザー1',
  email: 'tes1@example.com',
  account_type: mockAccountType,
}

describe('useCreateAccountMutation', () => {
  describe('正常系', () => {
    it('アカウント登録APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(createAccountService, 'createAccount').mockResolvedValue(mockCreateAccountResponse)

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockCreateAccountMutation = useCreateAccountMutation()
        return { mockQueryClient, mockCreateAccountMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockCreateAccountMutation.mutate(mockCreateAccountRequest)
      })

      await waitFor(() => {
        expect(result.current.mockCreateAccountMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockCreateAccountMutation.data).toEqual(mockCreateAccountResponse)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Accounts.all,
      })
    })
  })

  describe('異常系', () => {
    it('アカウント登録APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('アカウント登録に失敗しました')

      vi.spyOn(createAccountService, 'createAccount').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useCreateAccountMutation())

      act(() => {
        result.current.mutate(mockCreateAccountRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('アカウント登録に失敗しました')
    })
  })
})
