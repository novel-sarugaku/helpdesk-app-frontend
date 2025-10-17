import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type UseQueryResult } from '@tanstack/react-query'

import { customRender } from '@/tests/helpers/customRender'
import { HomeRootContainer } from '@/features/Home/Root/HomeRootContainer'
import * as HomeRootPresentational from '@/features/Home/Root/HomeRootPresentational'
import * as LoadingPresentational from '@/shared/ui/Loading/LoadingPresentational'
import * as useHealthcheckAuthQuery from '@/features/Login/Root/hooks/queries/useHealthcheckAuthQuery'

// Mocking the HomeRootPresentational component
vi.spyOn(HomeRootPresentational, 'HomeRootPresentational').mockImplementation(() => {
  return <div data-testid='mock-homeRootPresentational'>Mocked HomeRootPresentational</div>
})

// Mocking the LoadingPresentational component
vi.spyOn(LoadingPresentational, 'LoadingPresentational').mockImplementation(() => {
  return <div data-testid='mock-loadingPresentational'>Mocked LoadingPresentational</div>
})

// Mocking the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    // Navigateコンポーネント差し替え。props から to だけを取り出す
    Navigate: ({ to }: { to: string }) => <div data-testid='mock-navigate' data-to={to} />,
  }
})

// Mocking the useHealthcheckAuthQuer hook
const healthcheckAuthQuery = vi.spyOn(useHealthcheckAuthQuery, 'useHealthcheckAuthQuery')

describe('HomeRootContainer', () => {
  describe('正常系', () => {
    it('!isPending および !isError の場合、HomeRootPresentationalコンポーネントが表示される', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: false,
      } as unknown as UseQueryResult)

      beforeEach(() => {
        vi.clearAllMocks()
      })
      customRender(<HomeRootContainer />)

      expect(screen.getByTestId('mock-homeRootPresentational')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('isPending の場合、LoadingPresentationalコンポーネントが表示される', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: true,
        isError: false,
      } as unknown as UseQueryResult)

      customRender(<HomeRootContainer />)

      expect(screen.getByTestId('mock-loadingPresentational')).toBeInTheDocument()
    })

    it('isError の場合、Navigateコンポーネントが呼ばれる', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: true,
      } as unknown as UseQueryResult)

      customRender(<HomeRootContainer />)

      // .toHaveAttribute('data-to', '/login') → data-to という属性があり、その値が '/login' か
      expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/login')
    })
  })
})
