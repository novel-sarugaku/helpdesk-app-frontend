import { act } from 'react'
import { vi, describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLogoutMutation } from '../useLogoutMutation'
import * as authService from '@/services/internal/backend/v1/auth'

describe('useLogoutMutation', () => {
  describe('正常系', () => {
    it('ログアウトAPI呼び出しに成功する', async () => {
      vi.spyOn(authService, 'postLogout').mockResolvedValue()

      const { result } = customRenderHook(() => useLogoutMutation())

      act(() => {
        result.current.mutate()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.postLogout).toHaveBeenCalledTimes(1)
    })
  })

  describe('異常系', () => {
    it('ログアウトAPIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('ログアウトに失敗しました')

      vi.spyOn(authService, 'postLogout').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useLogoutMutation())

      act(() => {
        result.current.mutate()
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(authService.postLogout).toHaveBeenCalledTimes(1)
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('ログアウトに失敗しました')
    })
  })
})
