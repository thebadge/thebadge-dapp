import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgesYouOwnList from '@/src/pagePartials/profile/myProfile/BadgesYouOwnList'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'

type Props = {
  address: string
}

const SharedProfile = ({ address }: Props) => {
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
