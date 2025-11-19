import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { toaster } from '@/components/ui/toaster'
import * as ReactRouter from 'react-router'
import { type UseQueryResult } from '@tanstack/react-query'

import { customRender } from '@/tests/helpers/customRender'
import { TicketIdContainer } from '@/features/Ticket/Id/TicketIdContainer'
import * as useHealthcheckAuthQuery from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import * as useTicketDetailQuery from '@/features/Ticket/Id/hooks/queries/useTicketDetailQuery'
import * as TicketIdPresentational from '@/features/Ticket/Id/TicketIdPresentational'
import * as LoadingPresentational from '@/shared/ui/Loading/LoadingPresentational'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'
import { type AccountType } from '@/models/constants/accountType'
import {
  type GetTicketDetailResponse,
  type GetTicketHistoryResponseItem,
} from '@/models/api/internal/backend/v1/response/ticket'
import { type TicketStatusType } from '@/models/constants/ticketStatusType'
import * as useAssignSupporterHandler from '@/features/Ticket/Id/hooks/handlers/useAssignSupporterHandler'
import * as useUpdateTicketStatusHandler from '@/features/Ticket/Id/hooks/handlers/useUpdateTicketStatusHandler'

const mockTicketStatusType: TicketStatusType = 'start'
const mockGetTicketHistoryResponseItem: GetTicketHistoryResponseItem[] = [
  {
    id: 1,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴1',
    created_at: '2025-011-01',
  },
  {
    id: 2,
    ticket: 1,
    action_user: 'テスト社員1',
    action_description: 'テスト対応履歴2',
    created_at: '2025-011-01',
  },
]
const mockGetTicketDetailResponse: GetTicketDetailResponse = {
  id: 1,
  title: 'テストタイトル',
  is_public: true,
  status: mockTicketStatusType,
  description: 'テスト詳細',
  supporter: 'テストサポート担当者1',
  created_at: '2025-11-01T00:00:00Z',
  is_own_ticket: true,
  ticket_histories: mockGetTicketHistoryResponseItem,
}

// Mocking the TicketIdPresentational component
const mockTicketIdPresentational = vi
  .spyOn(TicketIdPresentational, 'TicketIdPresentational')
  .mockImplementation(() => {
    return <div data-testid='mock-ticketIdPresentational'>Mocked TicketIdPresentational</div>
  })

// Mocking the LoadingPresentational component
vi.spyOn(LoadingPresentational, 'LoadingPresentational').mockImplementation(() => {
  return <div data-testid='mock-loadingPresentational'>Mocked LoadingPresentational</div>
})

// Mocking the useParams hook
//.  vi.mock('react-router', async () => { ... } → react-router というモジュールをテスト用に差し替え宣言
vi.mock('react-router', async () => {
  return {
    // ...(await vi.importActual('react-router')) → 本物の 'react-router' を読み込みコピー
    ...(await vi.importActual('react-router')),
    // 必要な部分（useParams）だけ偽物にして、他は本物のまま
    useParams: vi.fn(),
  }
})

// Mocking the useNavigate hook
vi.mock('react-router-dom', async () => {
  return {
    ...(await vi.importActual('react-router-dom')),
    // Navigateコンポーネント差し替え。props から to だけを取り出す
    Navigate: ({ to }: { to: string }) => <div data-testid='mock-navigate' data-to={to} />,
  }
})

// Mocking the toaster
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

// Mocking the useHealthcheckAuthQuery hook
const mockUserAccountType: AccountType = 'staff'
const mockHealthcheckAuthQuery = vi.spyOn(useHealthcheckAuthQuery, 'useHealthcheckAuthQuery')
mockHealthcheckAuthQuery.mockReturnValue({
  isPending: false,
  isError: false,
  data: { account_type: mockUserAccountType },
} as unknown as UseQueryResult<HealthcheckAuthResponse>)

// Mocking the useTicketDetailQuery hook
const mockTicketDetailQuery = vi.spyOn(useTicketDetailQuery, 'useTicketDetailQuery')
mockTicketDetailQuery.mockReturnValue({
  isPending: false,
  isError: false,
  data: mockGetTicketDetailResponse,
} as unknown as UseQueryResult<GetTicketDetailResponse>)

// Mocking the useAssignSupporterHandler hook
const mockHandleAssignSupporter = vi.fn()
vi.spyOn(useAssignSupporterHandler, 'useAssignSupporterHandler').mockReturnValue({
  handleAssignSupporter: mockHandleAssignSupporter,
})

// Mocking the useUpdateTicketStatusHandler hook
const mockHandleUpdateTicketStatus = vi.fn()
vi.spyOn(useUpdateTicketStatusHandler, 'useUpdateTicketStatusHandler').mockReturnValue({
  handleUpdateTicketStatus: mockHandleUpdateTicketStatus,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TicketIdContainer', () => {
  describe('正常系', () => {
    it('useHealthcheckAuthQuery の isPending/isError および useTicketDetailQuery の isPending が false であり、ticketData が存在する場合、TicketIdPresentational に正しい props が渡され表示される', () => {
      vi.mocked(ReactRouter.useParams).mockReturnValue({ id: '1' })

      customRender(<TicketIdContainer />)

      expect(mockTicketDetailQuery).toHaveBeenCalledWith(1)
      expect(mockTicketIdPresentational.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          userAccountType: mockUserAccountType,
          ticketData: mockGetTicketDetailResponse,
          handleAssignSupporter: mockHandleAssignSupporter,
          handleUpdateTicketStatus: mockHandleUpdateTicketStatus,
        }),
      )
      expect(screen.getByTestId('mock-ticketIdPresentational')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('useHealthcheckAuthQuery の isPending が true の場合、LoadingPresentational が表示される', () => {
      mockHealthcheckAuthQuery.mockReturnValue({
        isPending: true,
        isError: false,
      } as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<TicketIdContainer />)

      expect(screen.getByTestId('mock-loadingPresentational')).toBeInTheDocument()
    })

    it('useHealthcheckAuthQuery の isError が true の場合、Navigateコンポーネントが呼ばれる', () => {
      mockHealthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: true,
      } as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<TicketIdContainer />)

      // .toHaveAttribute('data-to', '/login') → data-to という属性があり、その値が '/login' か
      expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/login')
    })

    it('useTicketDetailQuery の isPending が true の場合、LoadingPresentational が表示される', () => {
      mockHealthcheckAuthQuery.mockReturnValue({
        isPending: true,
        isError: false,
      } as UseQueryResult<HealthcheckAuthResponse>)

      customRender(<TicketIdContainer />)

      expect(screen.getByTestId('mock-loadingPresentational')).toBeInTheDocument()
    })

    it('ticketId は数字ではあるが、紐づく data がない場合、Navigateコンポーネントが呼ばれ、トーストが作成される', () => {
      vi.mocked(ReactRouter.useParams).mockReturnValue({ id: '12345' })

      mockHealthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: false,
        data: { account_type: mockUserAccountType },
      } as unknown as UseQueryResult<HealthcheckAuthResponse>)

      mockTicketDetailQuery.mockReturnValue({
        isPending: false,
        isError: false,
        data: undefined,
      } as unknown as UseQueryResult<GetTicketDetailResponse>)

      customRender(<TicketIdContainer />)

      expect(mockTicketDetailQuery).toHaveBeenCalledWith(12345)
      expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '指定したチケットは存在しません',
        type: 'error',
      })
    })

    it('ticketId が文字列である場合、Navigateコンポーネントが呼ばれ、トーストが作成される', () => {
      vi.mocked(ReactRouter.useParams).mockReturnValue({ id: 'abc' })

      mockHealthcheckAuthQuery.mockReturnValue({
        isPending: false,
        isError: false,
        data: { account_type: mockUserAccountType },
      } as unknown as UseQueryResult<HealthcheckAuthResponse>)

      mockTicketDetailQuery.mockReturnValue({
        isPending: false,
        isError: false,
        data: undefined,
      } as unknown as UseQueryResult<GetTicketDetailResponse>)

      customRender(<TicketIdContainer />)

      expect(mockTicketDetailQuery).toHaveBeenCalledWith(NaN)
      expect(screen.getByTestId('mock-navigate')).toHaveAttribute('data-to', '/')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '指定したチケットは存在しません',
        type: 'error',
      })
    })
  })
})
