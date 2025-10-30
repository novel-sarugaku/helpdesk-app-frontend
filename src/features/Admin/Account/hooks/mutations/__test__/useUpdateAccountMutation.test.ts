import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useUpdateAccountMutation } from '@/features/Admin/Account/hooks/mutations/useUpdateAccountMutation'
import { Accounts } from '@/features/Admin/Account/hooks/queries/queryKeys'
import * as updateAccountService from '@/services/internal/backend/v1/account'
import { type UpdateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type UpdateAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'staff'
const mockUpdateAccountRequest: UpdateAccountRequest = {
  id: 1,
  is_suspended: true,
}

const mockUpdateAccountResponse: UpdateAccountResponse = {
  id: 1,
  name: 'テストユーザー1',
  email: 'test1@example.com',
  account_type: mockUserAccountType,
  is_suspended: true,
}

describe('useUpdateAccountMutation', () => {
  describe('正常系', () => {
    it('アカウント利用状態更新APIの呼び出しに成功した場合、正しいレスポンスが返り、invalidateQueriesが呼ばれる', async () => {
      vi.spyOn(updateAccountService, 'updateAccount').mockResolvedValue(mockUpdateAccountResponse)

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUpdateAccountMutation = useUpdateAccountMutation()
        return { mockQueryClient, mockUpdateAccountMutation }
      })

      const mockInvalidateQueries = vi.spyOn(result.current.mockQueryClient, 'invalidateQueries')

      act(() => {
        result.current.mockUpdateAccountMutation.mutate(mockUpdateAccountRequest)
      })

      await waitFor(() => {
        expect(result.current.mockUpdateAccountMutation.isSuccess).toBe(true)
      })

      expect(result.current.mockUpdateAccountMutation.data).toEqual(mockUpdateAccountResponse)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: Accounts.all,
      })
    })
  })

  describe('異常系', () => {
    it('アカウント利用状態更新の呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('アカウントの利用状態の更新に失敗しました')

      vi.spyOn(updateAccountService, 'updateAccount').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useUpdateAccountMutation())

      act(() => {
        result.current.mutate(mockUpdateAccountRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('アカウントの利用状態の更新に失敗しました')
    })
  })
})
