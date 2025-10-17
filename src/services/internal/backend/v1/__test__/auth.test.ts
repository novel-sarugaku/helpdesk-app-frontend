import { describe, it, vi, expect } from 'vitest'

import * as client from '../client'
import { postLogin, postLogout } from '../auth'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

const mockLoginRequest: LoginRequest = {
  email: 'test@example.com',
  password: 'testPassword_12345',
}

describe('postLogin', () => {
  describe('正常系', () => {
    it('正しいリクエストとURLでPOSTし、成功する', async () => {
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockResolvedValue({ data: undefined })

      await expect(postLogin(mockLoginRequest)).resolves.toBeUndefined()

      expect(mockclientPost).toHaveBeenCalledTimes(1)
      expect(mockclientPost).toHaveBeenCalledWith('/auth/login', mockLoginRequest)
    })
  })

  describe('異常系', () => {
    it('POSTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('ログインに失敗しました')
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockRejectedValue(mockError)

      await expect(postLogin(mockLoginRequest)).rejects.toThrow(mockError)
      expect(mockclientPost).toHaveBeenCalledTimes(1)
    })
  })
})

describe('postLogout', () => {
  describe('正常系', () => {
    it('正しいリクエストとURLでPOSTし、成功する', async () => {
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockResolvedValue({ data: undefined })

      await expect(postLogout()).resolves.toBeUndefined()

      expect(mockclientPost).toHaveBeenCalledTimes(1)
      expect(mockclientPost).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('異常系', () => {
    it('POSTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('ログアウトに失敗しました')
      const mockclientPost = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockRejectedValue(mockError)

      await expect(postLogout()).rejects.toThrow(mockError)
      expect(mockclientPost).toHaveBeenCalledTimes(1)
    })
  })
})
