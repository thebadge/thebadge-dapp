import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'

export default function useIsThirdPartyUser(userAddress: `0x${string}` | undefined) {
  const isVerifiedInTp = useIsUserVerified(userAddress, 'thirdParty')
  return isVerifiedInTp.data
}
