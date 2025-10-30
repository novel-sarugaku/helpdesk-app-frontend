import { describe, it, expect, vi } from 'vitest'

import * as client from '../client'
import { getAccounts, createAccount, updateAccount } from '@/services/internal/backend/v1/account'
import {
  type CreateAccountRequest,
  type UpdateAccountRequest,
} from '@/models/api/internal/backend/v1/request/account'
import {
  type GetAccountResponseItem,
  type CreateAccountResponse,
  type UpdateAccountResponse,
} from '@/models/api/internal/backend/v1/response/account'
import { type AccountType } from '@/models/constants/accountType'

const mockUserAccountType: AccountType = 'staff'
const mockGetAccountResponse: GetAccountResponseItem[] = [
  {
    id: 1,
    name: 'テストユーザー1',
    email: 'test1@example.com',
    account_type: mockUserAccountType,
    is_suspended: false,
  },
  {
    id: 2,
    name: 'テストユーザー2',
    email: 'test2@example.com',
    account_type: mockUserAccountType,
    is_suspended: false,
  },
]

const mockCreateAccountRequest: CreateAccountRequest = {
  name: 'テストユーザー1',
  email: 'tes1@example.com',
  password: 'testPass123',
  account_type: mockUserAccountType,
}

const mockCreateAccountResponse: CreateAccountResponse = {
  id: 1,
  name: 'テストユーザー1',
  email: 'tes1@example.com',
  account_type: mockUserAccountType,
}

const mockUpdateAccountRequest: UpdateAccountRequest = {
  id: 1,
  is_suspended: true,
}

const mockUpdateAccountResponse: UpdateAccountResponse = {
  id: 1,
  name: 'テストユーザー1',
  email: 'test1@example.com',
  account_type: mockUserAccountType,
  is_suspended: true,
}

// アカウント全件取得
describe('getAccounts', () => {
  describe('正常系', () => {
    it('正しいURLでGETし、dataを返す', async () => {
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockResolvedValue({ data: mockGetAccountResponse })

      const result = await getAccounts()

      expect(mockClientGet).toHaveBeenCalledTimes(1)
      expect(mockClientGet).toHaveBeenCalledWith('/admin/account')
      expect(result).toEqual(mockGetAccountResponse)
    })
  })

  describe('異常系', () => {
    it('GETに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('アカウントの取得に失敗しました')
      const mockClientGet = vi
        .spyOn(client.internalBackendV1Client, 'get')
        .mockRejectedValue(mockError)

      await expect(getAccounts()).rejects.toThrow(mockError)

      expect(mockClientGet).toHaveBeenCalledTimes(1)
    })
  })
})

// アカウント登録
describe('createAccount', () => {
  describe('正常系', () => {
    it('正しいURL/ボディでPOSTし、dataを返す', async () => {
      const mockClientCreate = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockResolvedValue({ data: mockCreateAccountResponse })

      const result = await createAccount(mockCreateAccountRequest)

      expect(mockClientCreate).toHaveBeenCalledTimes(1)
      expect(mockClientCreate).toHaveBeenCalledWith('/admin/account', mockCreateAccountRequest)
      expect(result).toEqual(mockCreateAccountResponse)
    })
  })

  describe('異常系', () => {
    it('POSTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('アカウントの登録に失敗しました')
      const mockClientCreate = vi
        .spyOn(client.internalBackendV1Client, 'post')
        .mockRejectedValue(mockError)

      await expect(createAccount(mockCreateAccountRequest)).rejects.toThrow(mockError)

      expect(mockClientCreate).toHaveBeenCalledTimes(1)
    })
  })
})

// アカウント利用状態の更新
describe('updateAccount', () => {
  describe('正常系', () => {
    it('正しいURL/ボディでPUTし、dataを返す', async () => {
      const mockClientUpdate = vi
        .spyOn(client.internalBackendV1Client, 'put')
        .mockResolvedValue({ data: mockUpdateAccountResponse })

      const result = await updateAccount(mockUpdateAccountRequest)

      expect(mockClientUpdate).toHaveBeenCalledTimes(1)
      expect(mockClientUpdate).toHaveBeenCalledWith('/admin/account', mockUpdateAccountRequest)
      expect(result).toEqual(mockUpdateAccountResponse)
    })
  })

  describe('異常系', () => {
    it('PUTに失敗した場合、エラーを返す', async () => {
      const mockError = new Error('アカウントの利用状態の更新に失敗しました')
      const mockClientUpdate = vi
        .spyOn(client.internalBackendV1Client, 'put')
        .mockRejectedValue(mockError)

      await expect(updateAccount(mockUpdateAccountRequest)).rejects.toThrow(mockError)

      expect(mockClientUpdate).toHaveBeenCalledTimes(1)
    })
  })
})
