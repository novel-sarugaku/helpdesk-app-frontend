import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'
import { useHealthcheckAuthQuery } from '@/shared/hooks/queries/useHealthcheckAuthQuery'
import { useCreateTicketDialogCardHandler } from '@/features/Home/Root/hooks/handlers/useCreateTicketDialogCardHandler'
import { useTicketQuery } from '@/features/Home/Root/hooks/queries/useTicketQuery'

export const HomeRootContainer = () => {
  const { data, isError, isPending } = useHealthcheckAuthQuery()
  const { handleCreateTicket, isDialogOpen, onDialogOpenChange } =
    useCreateTicketDialogCardHandler()
  const { data: allTicketsList } = useTicketQuery()
  return useMemo(() => {
    if (isPending) return <LoadingPresentational />
    if (isError) return <Navigate to='/login' />
    return (
      <HomeRootPresentational
        userAccountType={data.account_type}
        allTicketsList={allTicketsList ?? []} // undefined/null のときだけ、空配列 []
        handleCreateTicket={handleCreateTicket}
        isDialogOpen={isDialogOpen}
        onDialogOpenChange={onDialogOpenChange}
      />
    )
  }, [
    isPending,
    isError,
    data,
    allTicketsList,
    handleCreateTicket,
    isDialogOpen,
    onDialogOpenChange,
  ])
}
