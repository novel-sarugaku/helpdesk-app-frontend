import { describe, it, expect } from 'vitest'

import { accountTypeToJa, publicationTypeToJa, ticketStatusToJa } from '../labelFormatters'
import { type AccountType } from '@/models/constants/accountType'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'

describe('labelFormatters', () => {
  describe('accountTypeToJa', () => {
    describe('正常系', () => {
      it('AccountType が「admin」のときは「管理者」を返す', () => {
        expect(accountTypeToJa('admin' as AccountType)).toBe('管理者')
      })

      it('AccountType が「staff」のときは「社員」を返す', () => {
        expect(accountTypeToJa('staff' as AccountType)).toBe('社員')
      })

      it('AccountType が「supporter」のときは「サポート担当者」を返す', () => {
        expect(accountTypeToJa('supporter' as AccountType)).toBe('サポート担当者')
      })
    })
  })

  describe('publicationTypeToJa', () => {
    describe('正常系', () => {
      it('「true」のときは「公開」を返す', () => {
        expect(publicationTypeToJa(true)).toBe('公開')
      })

      it('「false」のときは「非公開」を返す', () => {
        expect(publicationTypeToJa(false)).toBe('非公開')
      })
    })
  })

  describe('ticketStatusToJa', () => {
    describe('正常系', () => {
      it('TicketStatusType が「start」のときは「新規質問」を返す', () => {
        expect(ticketStatusToJa('start' as TicketStatusType)).toBe('新規質問')
      })

      it('TicketStatusType が「assigned」のときは「担当者割り当て済み」を返す', () => {
        expect(ticketStatusToJa('assigned' as TicketStatusType)).toBe('担当者割り当て済み')
      })

      it('TicketStatusType が「in_progress」のときは「対応中」を返す', () => {
        expect(ticketStatusToJa('in_progress' as TicketStatusType)).toBe('対応中')
      })

      it('TicketStatusType が「resolved」のときは「解決済み」を返す', () => {
        expect(ticketStatusToJa('resolved' as TicketStatusType)).toBe('解決済み')
      })

      it('TicketStatusType が「closed」のときは「クローズ」を返す', () => {
        expect(ticketStatusToJa('closed' as TicketStatusType)).toBe('クローズ')
      })
    })
  })
})
