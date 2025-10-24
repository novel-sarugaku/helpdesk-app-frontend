import { describe, it, expect, vi } from 'vitest'

import * as client from '../client'
import { getAccouns } from '@/services/internal/backend/v1/account'
import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'admin'
const mockGetAccountResponse: GetAccountResponse = {
  id: 1,
  name: 'テストユーザー',
  email: 'test@example.com',
  account_type: mockUserAccountType,
}

// アカウント全件取得
describe('getAccouns', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockclientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockGetAccountResponse })

      const result = await getAccouns()

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

      await expect(getAccouns()).rejects.toThrow(mockError)

      expect(mockclientGet).toHaveBeenCalledTimes(1)
    })
  })
})
