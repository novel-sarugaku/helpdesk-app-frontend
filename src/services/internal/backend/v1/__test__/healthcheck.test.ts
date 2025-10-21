import { describe, it, vi, expect } from 'vitest'

import * as client from '../client'
import { getHealthcheckAuth } from '../healthcheck'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'admin'
const mockHealthcheckAuthResponse: HealthcheckAuthResponse = { account_type: mockUserAccountType }

describe('getHealthcheckAuth', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockHealthcheckAuthResponse })

      const result = await getHealthcheckAuth()

      expect(mockclientPost).toHaveBeenCalledTimes(1)
      expect(mockclientPost).toHaveBeenCalledWith('/healthcheck/auth')
      expect(result).toEqual(mockHealthcheckAuthResponse)
    })
  })

  describe('異常系', () => {
    it('GETに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('ヘルスチェックの実行に失敗しました')
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockRejectedValue(mockError)

      await expect(getHealthcheckAuth()).rejects.toThrow(mockError)

      expect(mockclientPost).toHaveBeenCalledTimes(1)
    })
  })
})
