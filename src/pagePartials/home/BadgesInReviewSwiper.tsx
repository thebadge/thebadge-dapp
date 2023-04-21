import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'

const now = Math.floor(Date.now() / 1000)
export default function BadgesInReviewSwiper() {
  const router = useRouter()
  const gql = useSubgraph()

  const badgesInReview = gql.useBadgesInReview({ date: now })

  const badgesList = useMemo(() => {
    const badges = badgesInReview.data?.badges.map((badgeInReview) => {
      return (
        <Box
          key={badgeInReview.id}
          onClick={() =>
            router.push(`/badge/${badgeInReview.badgeType.id}/${badgeInReview.receiver.id}`)
          }
          sx={{ height: '100%', display: 'flex' }}
        >
          <SafeSuspense>
            <BadgeTypeMetadata metadata={badgeInReview?.badgeType.metadataURL} size="small" />
          </SafeSuspense>
        </Box>
      )
    })
    // TODO Remove badgesExampleList when we have more volumen to complete the list
    if (!badges) return badgesExampleList
    if (badges.length >= 5) {
      return badges
    }
    return [...badges, ...badgesExampleList]
  }, [badgesInReview.data?.badges, router])

  return <TBSwiper items={badgesList} />
}
