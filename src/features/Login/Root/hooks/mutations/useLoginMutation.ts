import { useMutation } from '@tanstack/react-query'
import { postLogin } from '@/services/internal/backend/v1/auth'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (request: LoginRequest) => postLogin(request),
  })
}
