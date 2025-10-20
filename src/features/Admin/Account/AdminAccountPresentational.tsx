import { Header } from '@/components/organisms/Header'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'

interface AdminAccountPresentationalProps {
  userAccountType: HealthcheckAuthResponse
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
