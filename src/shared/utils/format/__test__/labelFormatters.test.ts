import { describe, it, expect } from 'vitest'

import { type AccountType } from '@/models/constants/accountType'
import { accountTypeToJa } from '../labelFormatters'

describe('labelFormatters', () => {
  describe('accountTypeToJa', () => {
    describe('正常系', () => {
      it('AccountType が「admin」のときは空文字を返す', () => {
        expect(accountTypeToJa('admin' as AccountType)).toBe('')
      })

      it('AccountType が「staff」のときは「社員」を返す', () => {
        expect(accountTypeToJa('staff' as AccountType)).toBe('社員')
      })

      it('AccountType が「supporter」のときは「サポート担当者」を返す', () => {
        expect(accountTypeToJa('supporter' as AccountType)).toBe('サポート担当者')
      })
    })
  })
})
