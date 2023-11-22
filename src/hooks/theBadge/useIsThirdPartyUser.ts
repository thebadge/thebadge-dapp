import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import { WCAddress } from '@/types/utils'

export default function useIsThirdPartyUser(userAddress: WCAddress | undefined) {
  const isVerifiedInTp = useIsUserVerified(userAddress, 'thirdParty')
  return isVerifiedInTp.data
}
