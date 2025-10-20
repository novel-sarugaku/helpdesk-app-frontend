import { Header } from '@/components/organisms/Header'
import { type AccountType } from '@/models/constants/accountType'

interface AdminAccountPresentationalProps {
  userAccountType: AccountType
}

export const AdminAccountPresentational = ({
  userAccountType,
}: AdminAccountPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />
      <div>アカウント管理画面</div>
    </>
  )
}
