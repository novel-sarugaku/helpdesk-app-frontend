import { HeaderPresentational } from '@/components/organisms/HeaderPresentational'

interface HomeRootPresentationalProps {
  logout: () => Promise<void>
}

export const HomeRootPresentational = ({ logout }: HomeRootPresentationalProps) => {
  return (
    <>
      <HeaderPresentational logout={logout} />
    </>
  )
}
