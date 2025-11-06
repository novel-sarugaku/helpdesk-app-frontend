// フレームワークで使われるHookで、URLからパラメータを取得するために使用する
import { useParams } from 'react-router'
import { toaster } from '@/components/ui/toaster'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { TicketIdPresentational } from '@/features/Ticket/Id/TicketIdPresentational'

export const TicketIdContainer = () => {
  const { id } = useParams()
  // id がナンバーでない場合
  const ticketId = Number(id)

  const navigate = useNavigate()
  useEffect(() => {
    if (!ticketId) {
      toaster.create({
        description: '指定したチケットは存在しません',
        type: 'error',
      })
      return void navigate('/')
    }
  }, [ticketId, navigate])

  // 【TODO SIS-163 対応予定】 id がナンバーではあるが存在しない場合

  return <TicketIdPresentational ticketId={ticketId} />
}
