import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { EmptyBadgePreview } from '@thebadge/ui-library'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useSizeLG, useSizeMD } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'

const now = nowInSeconds()
export default function BadgesInReviewSwiper() {
  const router = useRouter()
  const gql = useSubgraph()
  const { address, appChainId } = useWeb3Connection()
  const md = useSizeMD()
  const lg = useSizeLG()

  const badgesUserCanReview = gql.useBadgesUserCanReview({ userAddress: address || '', date: now })

  const badgesList = useMemo(() => {
    const badges = badgesUserCanReview.data?.badges.map((badgeInReview) => {
      return (
        <Box
          key={badgeInReview.id}
          onClick={() =>
            router.push(
              generateBadgePreviewUrl(badgeInReview.id, {
                theBadgeContractAddress: badgeInReview.contractAddress,
                connectedChainId: appChainId,
              }),
            )
          }
          sx={{ height: '100%', display: 'flex' }}
        >
          <InViewPort minHeight={300}>
            <SafeSuspense>
              <BadgeModelPreview
                clickable={true}
                metadata={badgeInReview.badgeModel?.uri}
                size="small"
              />
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 4)
  }, [badgesUserCanReview.data?.badges, router, appChainId])

  const amountItems = () => {
    if (md) {
      return 1
    } else if (lg) {
      return 3
    } else {
      return 4
    }
  }

  return (
    <TBSwiper
      items={badgesList}
      leftPadding={'0px'}
      loop={false}
      rightPadding={'0px'}
      slidesPerView={amountItems()}
    />
  )
}
