import { getFormattedTimeLeft, timestampToDate } from "@/src/utils/date";
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { EmptyBadgePreview, PendingBadgeOverlay } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'

const now = Math.floor(Date.now() / 1000)
export default function PendingList() {
  const router = useRouter()
  const gql = useSubgraph()

  const badgesInReview = gql.useBadgesInReview({ date: now })

  const badgesList = useMemo(() => {
    const badges = badgesInReview.data?.badges.map((badgeInReview) => {
      console.log('badgeInReview', badgeInReview)
      const timeLeft = getFormattedTimeLeft(timestampToDate(badgeInReview.reviewDueDate))

      return (
        <Box
          key={badgeInReview.id}
          onClick={() =>
            router.push(`/badge/${badgeInReview.badgeType.id}/${badgeInReview.receiver.id}`)
          }
          sx={{ height: '100%', display: 'flex' }}
        >
          <SafeSuspense>
            <PendingBadgeOverlay
              badge={
                <BadgeTypeMetadata metadata={badgeInReview?.badgeType.metadataURL} size="small" />
              }
              timeLeft={timeLeft}
            />
          </SafeSuspense>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 5)
  }, [badgesInReview.data?.badges, router])

  return (
    <TBSwiper
      items={badgesList}
      itemsScale={'0.7'}
      leftPadding={'0'}
      maxSlidesPerView={2}
      spaceBetween={8}
    />
  )
}
