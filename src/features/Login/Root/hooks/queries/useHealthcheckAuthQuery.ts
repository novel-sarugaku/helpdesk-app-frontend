import { useQuery } from '@tanstack/react-query'
import { getHealthcheckAuth } from '@/services/internal/backend/v1/healthcheck'
import { healthcheckAuth } from '@/features/Login/Root/hooks/queries/queryKeys'

export const useHealthcheckAuthQuery = () => {
  return useQuery<unknown, Error, unknown>({
    queryKey: healthcheckAuth.all,
    queryFn: async () => {
      await getHealthcheckAuth()
      return null // queryFnは返り値が必要なため記載（getHealthcheckAuthは返り値なしのため）
    },
  })
}
