import { Header } from '@/components/organisms/Header'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'

interface AdminAccountPresentationalProps {
  userAccountType: AccountType
  allAccountsList: GetAccountResponseItem[]
  handleCreateAccount: (request: CreateAccountRequest) => void
  isDialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
  emailError: string | null
  setEmailError: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminAccountPresentational = ({
  userAccountType,
  allAccountsList,
  handleCreateAccount,
  isDialogOpen,
  onDialogOpenChange,
  emailError,
  setEmailError,
}: AdminAccountPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />

      <AccountTableCard
        allAccountsList={allAccountsList}
        handleCreateAccount={handleCreateAccount}
        isDialogOpen={isDialogOpen}
        onDialogOpenChange={onDialogOpenChange}
        emailError={emailError}
        setEmailError={setEmailError}
      />
    </>
  )
}
