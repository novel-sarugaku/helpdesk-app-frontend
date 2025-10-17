import { describe, it, vi, expect } from 'vitest'

import * as client from '../client'
import { getHealthcheckAuth } from '../healthcheck'

describe('getHealthcheckAuth', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、成功する', async () => {
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: undefined })

      await expect(getHealthcheckAuth()).resolves.toBeUndefined()

      expect(mockclientPost).toHaveBeenCalledTimes(1)
      expect(mockclientPost).toHaveBeenCalledWith('/healthcheck/auth')
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
