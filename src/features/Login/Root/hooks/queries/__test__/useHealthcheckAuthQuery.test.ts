import { describe, it, vi, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useHealthcheckAuthQuery } from '@/features/Login/Root/hooks/queries/useHealthcheckAuthQuery'
import * as getHealthcheckAuth from '@/services/internal/backend/v1/healthcheck'

describe('useHealthcheckAuthQuery', () => {
  describe('正常系', () => {
    it('アクセストークン確認API呼び出しに成功する', async () => {
      vi.spyOn(getHealthcheckAuth, 'getHealthcheckAuth').mockResolvedValue()

      const { result } = customRenderHook(() => useHealthcheckAuthQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(getHealthcheckAuth.getHealthcheckAuth).toHaveBeenCalledTimes(1)
      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
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
