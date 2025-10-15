import { useNavigate } from 'react-router-dom'
import { toaster } from '@/components/ui/toaster'

import { useLoginMutation } from '../mutations/useLoginMutation'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

export const useLoginHandler = () => {
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()

  const login = async (request: LoginRequest) => {
    // useLoginMutation を叩く
    await loginMutation.mutateAsync(request)

    // 成功したら / に遷移
    void navigate('/')

    // トースト表示
    toaster.create({
      type: 'success',
      description: 'ログインしました。',
    })
  }

  return {
    login,
    isError: loginMutation.isError,
  }
}
