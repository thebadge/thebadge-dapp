import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { EmptyBadgePreview, PendingBadgeOverlay } from '@thebadge/ui-library'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { TimeLeft, useDate } from '@/src/hooks/useDate'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'

const now = nowInSeconds()
export default function BadgesInReviewSwiper() {
  const router = useRouter()
  const gql = useSubgraph()
  const { getPendingTimeProgressPercentage, getTimeLeft, timestampToDate } = useDate()
  const badgesInReview = gql.useBadgesInReview({ date: now })

  const badgesList = useMemo(() => {
    const badges = badgesInReview.data?.badges.map((badgeInReview) => {
      const dueDate: Date = timestampToDate(badgeInReview.badgeKlerosMetaData?.reviewDueDate)
      const pendingTimeDurationSeconds: number =
        badgeInReview.badgeModel.badgeModelKleros?.challengePeriodDuration
      const timeLeft: TimeLeft = getTimeLeft(dueDate)
      const progressPercentage = getPendingTimeProgressPercentage(
        dueDate,
        pendingTimeDurationSeconds,
      )
      return (
        <Box
          key={badgeInReview.id}
          onClick={() => router.push(`/badge/preview/${badgeInReview.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <InViewPort minHeight={300}>
            <SafeSuspense>
              <PendingBadgeOverlay
                badge={<BadgeModelPreview metadata={badgeInReview.badgeModel?.uri} size="small" />}
                percentage={progressPercentage}
                timeLeft={timeLeft}
              />
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 5)
  }, [
    badgesInReview.data?.badges,
    getPendingTimeProgressPercentage,
    getTimeLeft,
    router,
    timestampToDate,
  ])

  return <TBSwiper items={badgesList} />
}
