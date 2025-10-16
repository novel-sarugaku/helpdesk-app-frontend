import { Header } from '@/components/organisms/Header'

interface HomeRootPresentationalProps {
  logout: () => Promise<void>
}

export const HomeRootPresentational = ({ logout }: HomeRootPresentationalProps) => {
  return (
    <>
      <Header logout={logout} />
    </>
  )
}
