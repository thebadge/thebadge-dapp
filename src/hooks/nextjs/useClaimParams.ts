import { useParams } from 'next/navigation'

/**
 * Helper hook to get the claimUUID from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useClaimParams() {
  const params = useParams()

  return {
    claimUUID: params?.claimUUID as string,
    contract: params?.contract as string,
    modelId: params?.modelId as string,
    badgeId: params?.badgeId as string,
  }
}
