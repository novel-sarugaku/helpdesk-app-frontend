import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import * as Header from '@/components/organisms/Header'

const defaultProps = {
  logout: vi.fn(),
}

// Mocking the Header component
vi.spyOn(Header, 'Header').mockImplementation(() => {
  return <div data-testid='mock-header'>Mocked Header</div>
})

describe('HomeRootPresentational', () => {
  describe('正常系', () => {
    it('Headerコンポーネントが表示される', () => {
      customRender(<HomeRootPresentational {...defaultProps} />)

      expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    })
  })
})
