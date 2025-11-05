import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { toaster } from '@/components/ui/toaster'
import * as ReactRouter from 'react-router'

import { customRender } from '@/tests/helpers/customRender'
import { TicketIdContainer } from '@/features/Ticket/Id/TicketIdContainer'
import * as TicketIdPresentational from '@/features/Ticket/Id/TicketIdPresentational'

// Mocking the TicketIdPresentational component
const mockTicketId = 1
const mockTicketIdPresentational = vi
  .spyOn(TicketIdPresentational, 'TicketIdPresentational')
  .mockImplementation(() => {
    return <div data-testid='mock-ticketIdPresentational'>Mocked TicketIdPresentational</div>
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
const mockUseNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  return {
    ...(await vi.importActual('react-router-dom')),
    // Navigateコンポーネント差し替え。props から to だけを取り出す
    useNavigate: () => mockUseNavigate,
  }
})

// Mocking the toaster
const mockToasterCreate = toaster.create
vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: vi.fn() },
}))

describe('TicketIdContainer', () => {
  describe('正常系', () => {
    it('id がある場合、TicketIdPresentationalコンポーネントに正しいpropsが渡され表示される', () => {
      vi.mocked(ReactRouter.useParams).mockReturnValue({ id: '1' })

      customRender(<TicketIdContainer />)

      expect(screen.getByTestId('mock-ticketIdPresentational')).toBeInTheDocument()
      expect(mockTicketIdPresentational.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          ticketId: mockTicketId,
        }),
      )
    })
  })

  describe('準正常系', () => {
    it('id がナンバーでない場合、トーストが作成され、useNavigateが呼ばれる', () => {
      vi.mocked(ReactRouter.useParams).mockReturnValue({ id: 'aaa' })

      customRender(<TicketIdContainer />)

      expect(mockToasterCreate).toHaveBeenCalledWith({
        description: '指定したチケットは存在しません',
        type: 'error',
      })
      expect(mockUseNavigate).toHaveBeenCalledWith('/')
    })
  })
})
