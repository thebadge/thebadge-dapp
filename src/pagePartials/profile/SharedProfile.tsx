import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import ProfileSelector from '@/src/pagePartials/profile/ProfileSelector'
import BadgesYouOwnList from '@/src/pagePartials/profile/myProfile/BadgesYouOwnList'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

type Props = {
  address: string
}

const SharedProfile = ({ address }: Props) => {
  const { address: connectedWalletAddress } = useWeb3Connection()
  const isLoggedInUser = connectedWalletAddress === address

  if (isLoggedInUser) {
    return <ProfileSelector />
  }

  return (
    <SafeSuspense>
      <SafeSuspense fallback={<InfoPreviewSkeleton />}>
        <InfoPreview address={address} />
      </SafeSuspense>
      <BadgesYouOwnList address={address} />
    </SafeSuspense>
  )
}

export default SharedProfile
