import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useAccountQuery } from '@/features/Admin/Account/hooks/queries/useAccountQuery'
import * as accouns from '@/services/internal/backend/v1/account'
import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'admin'
const mockGetAccountResponse: GetAccountResponse = {
  id: 1,
  name: 'テストユーザー',
  email: 'test@example.com',
  account_type: mockUserAccountType,
}

describe('useAccountQuery', () => {
  describe('正常系', () => {
    it('アカウント取得API呼び出しに成功した場合、正しいレスポンスを返す', async () => {
      vi.spyOn(accouns, 'getAccouns').mockResolvedValue(mockGetAccountResponse)

      const { result } = customRenderHook(() => useAccountQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(accouns.getAccouns).toHaveBeenCalledTimes(1)
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toEqual(mockGetAccountResponse)
    })
  })

  describe('異常系', () => {
    it('アカウント取得API呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('失敗しました')
      vi.spyOn(accouns, 'getAccouns').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useAccountQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(accouns.getAccouns).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('失敗しました')
    })
  })
})
