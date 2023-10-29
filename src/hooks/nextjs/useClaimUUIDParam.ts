import { useRouter } from 'next/navigation'

/**
 * Helper hook to get the claimUUID from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useClaimUUIDParam() {
  const router = useRouter()

  return router.query.claimUUID as string
}
