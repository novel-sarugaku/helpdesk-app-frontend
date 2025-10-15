import { act } from 'react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { type UseMutationResult } from '@tanstack/react-query'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLoginHandler } from '../useLoginHandler'
import * as loginMutationModule from '../../mutations/useLoginMutation'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

// Mocking the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mocking the useLoginMutation hook
const mockUseLoginMutation = vi.spyOn(loginMutationModule, 'useLoginMutation')
const mockMutateAsync = vi.fn().mockResolvedValue(undefined)
mockUseLoginMutation.mockReturnValue({
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<void, Error, LoginRequest>)

// 各テストの前にすべてのモックの呼び出し履歴を消す
beforeEach(() => {
  vi.clearAllMocks()
})

describe('useLoginHandler', () => {
  describe('正常系', () => {
    it('ログイン成功に成功した場合、mutateAsync、navigate が呼ばれる', async () => {
      const { result } = customRenderHook(() => useLoginHandler())

      const request: LoginRequest = { email: 'test@example.com', password: 'testPassword_12345' }

      await act(() => result.current.login(request))

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(request)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('異常系', () => {
    it('ログインに失敗した場合、navigate は呼ばれない', async () => {
      const mockError = new Error('ログインに失敗しました')
      const mockMutateAsyncError = vi.fn().mockRejectedValue(mockError)
      mockUseLoginMutation.mockReturnValue({
        mutateAsync: mockMutateAsyncError,
      } as unknown as UseMutationResult<void, Error, LoginRequest>)

      const { result } = customRenderHook(() => useLoginHandler())

      const request: LoginRequest = {
        email: 'wrongTest@example.com',
        password: 'wrongTestPassword_12345',
      }

      // 非同期が失敗（UI更新なし）：expect(...).rejects
      await expect(result.current.login(request)).rejects.toThrow('ログインに失敗しました')

      expect(mockMutateAsyncError).toHaveBeenCalledTimes(1)
      expect(mockMutateAsyncError).toHaveBeenCalledWith(request)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
