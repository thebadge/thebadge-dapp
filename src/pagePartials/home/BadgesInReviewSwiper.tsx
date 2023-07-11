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
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const now = nowInSeconds()
export default function BadgesInReviewSwiper() {
  const router = useRouter()
  const gql = useSubgraph()
  const { address } = useWeb3Connection()
  const badgesUserCanReview = gql.useBadgesUserCanReview({ userAddress: address || '', date: now })

  const badgesList = useMemo(() => {
    const badges = badgesUserCanReview.data?.badges.map((badgeInReview) => {
      return (
        <Box
          key={badgeInReview.id}
          onClick={() => router.push(`/badge/preview/${badgeInReview.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <InViewPort minHeight={300}>
            <SafeSuspense>
              <BadgeModelPreview metadata={badgeInReview.badgeModel?.uri} size="small" />
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 5)
  }, [badgesUserCanReview.data?.badges, router])

  return <TBSwiper items={badgesList} />
}
