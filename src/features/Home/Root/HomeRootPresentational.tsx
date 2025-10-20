import { Header } from '@/components/organisms/Header'
import { type AccountType } from '@/models/constants/accountType'

interface HomeRootPresentationalProps {
  userAccountType: AccountType
}

export const HomeRootPresentational = ({ userAccountType }: HomeRootPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />
    </>
  )
}
