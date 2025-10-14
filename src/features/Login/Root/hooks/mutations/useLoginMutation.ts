import { useMutation } from '@tanstack/react-query'
import { postLogin } from '@/services/internal/backend/v1/auth'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'
import { type LoginResponse } from '@/models/api/internal/backend/v1/response/auth'

export const useLoginMutation = () => {
	return useMutation<LoginResponse, Error, LoginRequest>({
		mutationFn: postLogin,
	})
}
