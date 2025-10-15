import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { LoginRootContainer } from '@/features/Login/Root/LoginRootContainer'
import * as LoginRootPresentational from '@/features/Login/Root/LoginRootPresentational'

// Mocking the LoginRootPresentational component
vi.spyOn(LoginRootPresentational, 'LoginRootPresentational').mockImplementation(() => {
  return <div data-testid='mock-loginRootPresentational'>Mocked LoginRootPresentational</div>
})

describe('LoginRootContainer', () => {
  describe('正常系', () => {
    it('LoginRootPresentationalコンポーネントが表示される', () => {
      customRender(<LoginRootContainer />)

      expect(screen.getByTestId('mock-loginRootPresentational')).toBeInTheDocument()
    })
  })
})
