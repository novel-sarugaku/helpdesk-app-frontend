import { act } from 'react'
import { vi, describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLoginMutation } from '../useLoginMutation'
import * as authService from '@/services/internal/backend/v1/auth'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

const mockLoginRequest: LoginRequest = {
  email: 'test@example.com',
  password: 'testPassword_12345',
}

describe('useLoginMutation', () => {
  describe('正常系', () => {
    it('ログイン認証API呼び出しに成功する', async () => {
      vi.spyOn(authService, 'postLogin').mockResolvedValue()

      const { result } = customRenderHook(() => useLoginMutation())

      act(() => {
        result.current.mutate(mockLoginRequest)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.postLogin).toHaveBeenCalledTimes(1)
    })
  })

  describe('異常系', () => {
    it('ログイン認証APIの呼び出しに失敗した場合、エラーが返される', async () => {
      const mockError = new Error('ログインに失敗しました')

      vi.spyOn(authService, 'postLogin').mockRejectedValue(mockError)

      const { result } = customRenderHook(() => useLoginMutation())

      act(() => {
        result.current.mutate(mockLoginRequest)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(authService.postLogin).toHaveBeenCalledTimes(1)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('ログインに失敗しました')
    })
  })
})
