import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type UseQueryResult } from '@tanstack/react-query'

import { customRender } from '@/tests/helpers/customRender'
import { AdminAccountContainer } from '@/features/Admin/Account/AdminAccountContainer'
import * as AdminAccountPresentational from '@/features/Admin/Account/AdminAccountPresentational'
import * as LoadingPresentational from '@/shared/ui/Loading/LoadingPresentational'
import * as useHealthcheckAuthQuery from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'
import { type AccountType } from '@/models/constants/accountType'

// Mocking the AdminAccountPresentational component
const mockAdminAccountPresentational = vi
  .spyOn(AdminAccountPresentational, 'AdminAccountPresentational')
  .mockImplementation(() => {
    return (
      <div data-testid='mock-adminAccountPresentational'>Mocked AdminAccountPresentational</div>
    )
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

// Mocking the useHealthcheckAuthQuery hook
const mockUserAccountType: AccountType = 'admin'
const healthcheckAuthQuery = vi.spyOn(useHealthcheckAuthQuery, 'useHealthcheckAuthQuery')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AdminAccountContainer', () => {
  describe('正常系', () => {
    it('!isPending および !isError の場合、AdminAccountPresentationalコンポーネントに正しいpropsが渡され表示される', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: false,
        data: { account_type: mockUserAccountType },
      } as unknown as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<AdminAccountContainer />)

      expect(screen.getByTestId('mock-adminAccountPresentational')).toBeInTheDocument()
      expect(mockAdminAccountPresentational.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
        }),
      )
    })
  })

  describe('準正常系', () => {
    it('isPending の場合、LoadingPresentationalコンポーネントが表示される', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: true,
        isError: false,
      } as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<AdminAccountContainer />)

      expect(screen.getByTestId('mock-loadingPresentational')).toBeInTheDocument()
    })

    it('isError の場合、Navigateコンポーネントが呼ばれる', () => {
      healthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: true,
      } as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<AdminAccountContainer />)

      // .toHaveAttribute('data-to', '/login') → data-to という属性があり、その値が '/login' か
      expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/login')
    })
  })
})
