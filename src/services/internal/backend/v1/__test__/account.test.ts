import { describe, it, expect, vi } from 'vitest'

import * as client from '../client'
import { getAccounts } from '@/services/internal/backend/v1/account'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'admin'
const mockGetAccountResponse: GetAccountResponseItem[] = [
  {
    id: 1,
    name: 'テストユーザー1',
    email: 'test1@example.com',
    account_type: mockUserAccountType,
  },
  {
    id: 2,
    name: 'テストユーザー2',
    email: 'test2@example.com',
    account_type: mockUserAccountType,
  },
]

// アカウント全件取得
describe('getAccounts', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockclientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockGetAccountResponse })

      const result = await getAccounts()

      expect(mockclientGet).toHaveBeenCalledTimes(1)
      expect(mockclientGet).toHaveBeenCalledWith('/admin/account')
      expect(result).toEqual(mockGetAccountResponse)
    })
  })

  describe('異常系', () => {
    it('GETに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('アカウントの取得に失敗しました')
      const mockclientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockRejectedValue(mockError)

      await expect(getAccounts()).rejects.toThrow(mockError)

      expect(mockclientGet).toHaveBeenCalledTimes(1)
    })
  })
})
