import { describe, it, vi, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { LoginRootPresentational } from '../LoginRootPresentational'

const mockLogin = vi.fn()
const defaultProps = {
  login: mockLogin,
  isError: false,
}

const isErrorProps = {
  ...defaultProps,
  isError: true,
}

describe('Header', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示され、input要素に placeholder が存在する', () => {
      customRender(<LoginRootPresentational {...defaultProps} />)

      expect(screen.getByText('NOVEL HELPDESK')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Pass')).toBeInTheDocument()

      expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('examplePassword123')).toBeInTheDocument()
    })

    it('「Login」を押下すると、login が呼ばれる', () => {
      customRender(<LoginRootPresentational {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      expect(mockLogin).toHaveBeenCalledTimes(1)
    })

    it('IDとPassの入力内容が正しくない（または空欄）場合、メッセージが表示される。', () => {
      customRender(<LoginRootPresentational {...isErrorProps} />)

      expect(screen.getByRole('alert')).toHaveTextContent('ログインに失敗しました。')
      expect(screen.getByRole('alert')).toHaveTextContent('正しいIDとPassを入力してください。')
    })
  })
})
