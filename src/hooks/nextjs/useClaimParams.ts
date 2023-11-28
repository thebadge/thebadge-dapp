import { useRouter } from 'next/router'

/**
 * Helper hook to get the claimUUID from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useClaimParams() {
  const router = useRouter()

  return {
    claimUUID: router.query.claimUUID as string,
    contract: router.query.contract as string,
    modelId: router.query.modelId as string,
    badgeId: router.query.badgeId as string,
  }
}
