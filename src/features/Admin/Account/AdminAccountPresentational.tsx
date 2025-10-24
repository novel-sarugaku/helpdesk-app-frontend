import { Header } from '@/components/organisms/Header'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'

interface AdminAccountPresentationalProps {
  userAccountType: AccountType
  userAccountData: GetAccountResponse[]
}

export const AdminAccountPresentational = ({
  userAccountType,
  userAccountData,
}: AdminAccountPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />

      <AccountTableCard userAccountData={userAccountData} />
    </>
  )
}
