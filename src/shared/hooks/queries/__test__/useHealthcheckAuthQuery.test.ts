import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import * as getHealthcheckAuth from '@/services/internal/backend/v1/healthcheck'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'

const mockHealthcheckAuthResponse: HealthcheckAuthResponse = 'admin'

describe('useHealthcheckAuthQuery', () => {
  describe('正常系', () => {
    it('アクセストークン確認API呼び出しに成功した場合、正しいレスポンスを返す', async () => {
      vi.spyOn(getHealthcheckAuth, 'getHealthcheckAuth').mockResolvedValue(
        mockHealthcheckAuthResponse,
      )

      const { result } = customRenderHook(() => useHealthcheckAuthQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(getHealthcheckAuth.getHealthcheckAuth).toHaveBeenCalledTimes(1)
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.data).toEqual(mockHealthcheckAuthResponse)
    })
  })

  describe('異常系', () => {
    it('アクセストークン確認API呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('失敗しました')
      vi.spyOn(getHealthcheckAuth, 'getHealthcheckAuth').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useHealthcheckAuthQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(getHealthcheckAuth.getHealthcheckAuth).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('失敗しました')
    })
  })
})
