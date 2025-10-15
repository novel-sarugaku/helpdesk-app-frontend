import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toaster } from '@/components/ui/toaster'

import { useLogoutMutation } from '@/shared/hooks/mutations/useLogoutMutation'

export const useLogoutHandler = () => {
  const logoutMutation = useLogoutMutation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = async () => {
    // useLogoutMutation を叩く
    await logoutMutation.mutateAsync()
    // 成功したら React Query のキャッシュを clear() で全消しにし、 /login に遷移
    queryClient.clear()

    void navigate('/login')

    // トースト表示
    toaster.create({
      type: 'success',
      description: 'ログアウトしました。',
    })
  }

  return {
    logout,
  }
}
