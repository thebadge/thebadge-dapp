import { useRouter } from 'next/router'

/**
 * Helper hook to get the modelId from the url params, as we are not using the app directory yet, we encapsulate this on a
 * custom hook that is easy to replace if we migrate
 */
export default function useModelIdParam() {
  const router = useRouter()

  return {
    badgeModelId: router.query.modelId as string,
    contract: router.query.contract as string,
  }
}
