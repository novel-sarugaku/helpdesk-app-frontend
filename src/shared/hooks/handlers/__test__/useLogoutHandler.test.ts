import { act } from 'react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toaster } from '@/components/ui/toaster'

import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { useLogoutHandler } from '@/shared/hooks/handlers/useLogoutHandler'
import * as logoutMutation from '@/shared/hooks/mutations/useLogoutMutation'

// Mocking the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mocking the useLogoutMutation hook
const mockUseLogoutMutation = vi.spyOn(logoutMutation, 'useLogoutMutation')
const mockMutateAsync = vi.fn().mockResolvedValue(undefined)
mockUseLogoutMutation.mockReturnValue({
  mutateAsync: mockMutateAsync,
} as unknown as UseMutationResult<void, Error, void>)

// Mocking the toaster
const createSuccessMessage = 'ログアウトしました。'
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

// 各テストの前にすべてのモックの呼び出し履歴を消す
beforeEach(() => {
  vi.clearAllMocks()
})

describe('useLogoutHandler', () => {
  describe('正常系', () => {
    it('ログアウトに成功した場合、mutateAsync、clear、navigate、toaster.create が呼ばれる', async () => {
      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUseLogoutHandler = useLogoutHandler()
        return { mockQueryClient, mockUseLogoutHandler }
      })

      const mockQueryClientClear = vi.spyOn(result.current.mockQueryClient, 'clear')

      await act(() => result.current.mockUseLogoutHandler.logout())

      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockQueryClientClear).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        description: createSuccessMessage,
      })
    })
  })

  describe('異常系', () => {
    it('ログアウトに失敗した場合、clear、navigate、toaster.create は呼ばれない', async () => {
      const mockError = new Error('ログアウトに失敗しました')
      const mockMutateAsyncError = vi.fn().mockRejectedValue(mockError)
      mockUseLogoutMutation.mockReturnValue({
        mutateAsync: mockMutateAsyncError,
      } as unknown as UseMutationResult<void, Error, void>)

      const { result } = customRenderHook(() => {
        const mockQueryClient = useQueryClient()
        const mockUseLogoutHandler = useLogoutHandler()
        return { mockQueryClient, mockUseLogoutHandler }
      })

      const mockQueryClientClear = vi.spyOn(result.current.mockQueryClient, 'clear')

      // 非同期が失敗（UI更新なし）：expect(...).rejects
      await expect(result.current.mockUseLogoutHandler.logout()).rejects.toThrow(
        'ログアウトに失敗しました',
      )

      expect(mockMutateAsyncError).toHaveBeenCalledTimes(1)
      expect(mockQueryClientClear).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockToasterCreate).not.toHaveBeenCalled()
    })
  })
})
