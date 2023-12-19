import { useRouter } from 'next/navigation'

/**
 * Helper hook to get the badgeId from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useBadgeIdParam() {
  const router = useRouter()

  return {
    badgeId: router.query.badgeId as string,
    contract: router.query.contract as string,
  }
}
