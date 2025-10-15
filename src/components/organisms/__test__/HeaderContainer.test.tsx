import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HeaderContainer } from '@/components/organisms/HeaderContainer'
import * as HeaderPresentational from '@/components/organisms/HeaderPresentational'

// Mocking the HeaderPresentational component
vi.spyOn(HeaderPresentational, 'HeaderPresentational').mockImplementation(() => {
  return <div data-testid='mock-headerPresentational'>Mocked HeaderPresentational</div>
})

describe('HeaderContainer', () => {
  describe('正常系', () => {
    it('HeaderPresentationalコンポーネントが表示される', () => {
      customRender(<HeaderContainer />)

      expect(screen.getByTestId('mock-headerPresentational')).toBeInTheDocument()
    })
  })
})
