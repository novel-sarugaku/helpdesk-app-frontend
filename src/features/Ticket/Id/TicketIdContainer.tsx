// フレームワークで使われるHookで、URLからパラメータを取得するために使用する
import { useParams } from 'react-router'
import { toaster } from '@/components/ui/toaster'
import { Navigate } from 'react-router-dom'

import { TicketIdPresentational } from '@/features/Ticket/Id/TicketIdPresentational'
import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import { useTicketDetailQuery } from '@/features/Ticket/Id/hooks/queries/useTicketDetailQuery'
import { useAssignSupporterHandler } from '@/features/Ticket/Id/hooks/handlers/useAssignSupporterHandler'
import { useUnassignSupporterHandler } from '@/features/Ticket/Id/hooks/handlers/useUnassignSupporterHandler'
import { useUpdateTicketStatusHandler } from '@/features/Ticket/Id/hooks/handlers/useUpdateTicketStatusHandler'
import { useCreateTicketCommentFormCardHandler } from '@/features/Ticket/Id/hooks/handlers/useCreateTicketCommentFormCardHandler'
import { useUpdateTicketVisibilityHandler } from '@/features/Ticket/Id/hooks/handlers/useUpdateTicketVisibilityHandler'

export const TicketIdContainer = () => {
  const { data, isPending, isError } = useHealthcheckAuthQuery()
  const { id } = useParams()
  const ticketId = Number(id)
  const { data: ticketData, isPending: getTicketPending } = useTicketDetailQuery(ticketId)
  const { handleAssignSupporter } = useAssignSupporterHandler(ticketId)
  const { handleUnassignSupporter } = useUnassignSupporterHandler(ticketId)
  const { handleUpdateTicketStatus } = useUpdateTicketStatusHandler(ticketId)
  const { handleCreateTicketComment } = useCreateTicketCommentFormCardHandler(ticketId)
  const { handleUpdateTicketVisibility } = useUpdateTicketVisibilityHandler(ticketId)

  // ヘルスチェックで isPending の場合は、ローディング画面へ遷移
  if (isPending) return <LoadingPresentational />

  // ヘルスチェックで isError の場合は、ログイン画面へ遷移
  if (isError) return <Navigate to='/login' />

  // getTicketPending の場合は、ローディング画面へ遷移（データ読み込み時間中は undefined のため、完了するまでの対応）
  if (getTicketPending) return <LoadingPresentational />

  // 指定したチケットが存在しない場合、トースト表示
  if (!ticketData) {
    toaster.create({ description: '指定したチケットは存在しません', type: 'error' })
    return <Navigate to='/' />
  }

  return (
    <TicketIdPresentational
      userAccountType={data.account_type}
      ticketData={ticketData}
      handleAssignSupporter={handleAssignSupporter}
      handleUnassignSupporter={handleUnassignSupporter}
      handleUpdateTicketStatus={handleUpdateTicketStatus}
      handleCreateTicketComment={handleCreateTicketComment}
      handleUpdateTicketVisibility={handleUpdateTicketVisibility}
    />
  )
}
