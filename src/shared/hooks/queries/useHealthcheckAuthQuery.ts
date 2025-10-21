import { useQuery } from '@tanstack/react-query'
import { getHealthcheckAuth } from '@/services/internal/backend/v1/healthcheck'
import { healthcheckAuth } from '@/shared/hooks/queries/queryKeys'
import { type HealthcheckAuthResponse } from '@/models/api/internal/backend/v1/response/healthcheck'

export const useHealthcheckAuthQuery = () => {
  return useQuery<HealthcheckAuthResponse, Error, HealthcheckAuthResponse>({
    queryKey: healthcheckAuth.checkAuth,
    queryFn: getHealthcheckAuth,
  })
}
