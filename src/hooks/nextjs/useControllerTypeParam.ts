import { useRouter } from 'next/router'

import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

/**
 * Helper hook to get the modelId from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useControllerTypeParam() {
  const router = useRouter()

  return router.query.controllerType as BadgeModelControllerType
}
