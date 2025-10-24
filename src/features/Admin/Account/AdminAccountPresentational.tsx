import { Header } from '@/components/organisms/Header'
import { AccountTableCard } from '@/features/Admin/Account/ui/AccountTableCard/AccountTableCard'
import { type AccountType } from '@/models/constants/accountType'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'

interface AdminAccountPresentationalProps {
  userAccountType: AccountType
  allAccountsList: GetAccountResponseItem[]
}

export const AdminAccountPresentational = ({
  userAccountType,
  allAccountsList,
}: AdminAccountPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />

      <AccountTableCard allAccountsList={allAccountsList} />
    </>
  )
}
