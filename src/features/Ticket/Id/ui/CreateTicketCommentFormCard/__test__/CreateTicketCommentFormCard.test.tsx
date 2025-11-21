import { act } from 'react'
import { describe, it, vi, expect } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { CreateTicketCommentFormCard } from '@/features/Ticket/Id/ui/CreateTicketCommentFormCard/CreateTicketCommentFormCard'
import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'

const mockHandleCreateTicketComment = vi.fn()
const defaultProps = {
  handleCreateTicketComment: mockHandleCreateTicketComment,
}

const mockComment = 'テスト質疑応答'
const mockCreateTicketCommentRequest: CreateTicketCommentRequest = {
  comment: mockComment,
}

describe('CreateTicketCommentFormCard', () => {
  describe('正常系', () => {
    it('表示されるべきテキストとボタンが表示される', () => {
      customRender(<CreateTicketCommentFormCard {...defaultProps} />)

      expect(screen.getByText('質疑応答')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument()
    })

    it('textarea 要素に required が存在する', () => {
      customRender(<CreateTicketCommentFormCard {...defaultProps} />)

      expect(screen.getByRole('textbox')).toBeRequired() // textarea は ロールとしては textbox を持つ
    })

    it('質疑応答内容を入力して送信すると、handleCreateTicketComment にリクエストが渡る', () => {
      customRender(<CreateTicketCommentFormCard {...defaultProps} />)

      fireEvent.change(screen.getByRole('textbox'), { target: { value: mockComment } })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: '送信' }))
      })

      expect(mockHandleCreateTicketComment).toHaveBeenCalledTimes(1)
      expect(mockHandleCreateTicketComment).toHaveBeenCalledWith(mockCreateTicketCommentRequest)
    })
  })
})
