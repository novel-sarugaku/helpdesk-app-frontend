import { Header } from '@/components/organisms/Header'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { Toaster } from '@/components/ui/toaster'

interface AdminAccountPresentationalProps {
  userAccountType: AccountType
  allAccountsList: GetAccountResponseItem[]
  handleCreateAccount: (request: CreateAccountRequest) => Promise<void>
  isDialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
  formError: string | null
  setFormError: React.Dispatch<React.SetStateAction<string | null>>
  changeAccountStatus: (account: GetAccountResponseItem) => Promise<void>
}

export const AdminAccountPresentational = ({
  userAccountType,
  allAccountsList,
  handleCreateAccount,
  isDialogOpen,
  onDialogOpenChange,
  formError,
  setFormError,
  changeAccountStatus,
}: AdminAccountPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />
      <Toaster />

      <AccountTableCard
        allAccountsList={allAccountsList}
        handleCreateAccount={handleCreateAccount}
        isDialogOpen={isDialogOpen}
        onDialogOpenChange={onDialogOpenChange}
        formError={formError}
        setFormError={setFormError}
        changeAccountStatus={changeAccountStatus}
      />
    </>
  )
}
