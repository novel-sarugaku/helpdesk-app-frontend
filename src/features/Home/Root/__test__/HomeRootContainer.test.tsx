import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HomeRootContainer } from '@/features/Home/Root/HomeRootContainer'
import * as HomeRootPresentational from '@/features/Home/Root/HomeRootPresentational'

// Mocking the HomeRootPresentational component
vi.spyOn(HomeRootPresentational, 'HomeRootPresentational').mockImplementation(() => {
  return <div data-testid='mock-homeRootPresentational'>Mocked BalanceTotalCard</div>
})

describe('HomeRootContainer', () => {
  describe('正常系', () => {
    it('HomeRootPresentationalコンポーネントが表示される', () => {
      customRender(<HomeRootContainer />)

      expect(screen.getByTestId('mock-homeRootPresentational')).toBeInTheDocument()
    })
  })
})
