import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { TicketCreateDialogCard } from '@/features/Home/Root/ui/TicketCreateDialogCard/TicketCreateDialogCard'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'

const mockHandleCreateTicket = vi.fn()
const mockIsDialogOpen = true
const mockOnDialogOpenChange = vi.fn()
const defaultProps = {
  handleCreateTicket: mockHandleCreateTicket,
  isDialogOpen: mockIsDialogOpen,
  onDialogOpenChange: mockOnDialogOpenChange,
}

const mockTitle = 'テストタイトル'
const mockDescription = 'テスト詳細'
const mockCreateTicketRequest: CreateTicketRequest = {
  title: mockTitle,
  is_public: false,
  description: mockDescription,
}

const headers = ['公開設定', 'タイトル', '詳細']

describe('TicketCreateDialogCard', () => {
  describe('正常系', () => {
    it('チケット登録ダイアログ上に表示されるべきテキストが表示される', () => {
      customRender(<TicketCreateDialogCard {...defaultProps} />)

      headers.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument()
      })
    })

    it('公開設定 のデフォルトは「公開」', () => {
      customRender(<TicketCreateDialogCard {...defaultProps} />)

      expect(screen.getByRole('radio', { name: '公開' })).toBeChecked()
    })

    it('タイトル/詳細 の textarea 要素に required が存在する', () => {
      customRender(<TicketCreateDialogCard {...defaultProps} />)

      expect(screen.getByLabelText('タイトル')).toBeRequired()
      expect(screen.getByLabelText('詳細')).toBeRequired()
    })

    it('タイトル の textarea 要素に maxLength/placeholder が存在する', () => {
      customRender(<TicketCreateDialogCard {...defaultProps} />)

      expect(screen.getByLabelText('タイトル')).toHaveAttribute('maxLength', '255')
      expect(screen.getByLabelText('タイトル')).toHaveAttribute(
        'placeholder',
        '最大255文字まで入力可能です',
      )
    })

    it('公開設定/タイトル/詳細 を入力して送信すると、handleCreateTicket にリクエストが渡る', () => {
      customRender(<TicketCreateDialogCard {...defaultProps} />)

      // .click(): クリックを再現、 .change()：入力操作を再現
      fireEvent.click(screen.getByRole('radio', { name: '非公開' }))
      fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: mockTitle } })
      fireEvent.change(screen.getByLabelText('詳細'), { target: { value: mockDescription } })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: '送信' }))
      })

      expect(mockHandleCreateTicket).toHaveBeenCalledTimes(1)
      expect(mockHandleCreateTicket).toHaveBeenCalledWith(mockCreateTicketRequest)
    })
  })
})
