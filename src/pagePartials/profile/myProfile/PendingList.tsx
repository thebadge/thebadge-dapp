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
import { useSizeLG } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const now = nowInSeconds()
export default function PendingList() {
  const router = useRouter()
  const gql = useSubgraph()
  const { getPendingTimeProgressPercentage, getTimeLeft, timestampToDate } = useDate()
  const { address: ownerAddress } = useWeb3Connection()
  const badgesInReview = gql.useUserBadgesInReviewAndChallenged({
    ownerAddress: ownerAddress || '',
    date: now,
  })

  const badgesList = useMemo(() => {
    const badges = badgesInReview.data?.user?.badges?.map((badgeInReview) => {
      console.log('badge', badgeInReview)
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
          sx={{ height: '100%', display: 'flex', cursor: 'pointer' }}
        >
          <InViewPort color={'green'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'green'}>
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
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 2)
  }, [
    badgesInReview.data?.user?.badges,
    getPendingTimeProgressPercentage,
    getTimeLeft,
    router,
    timestampToDate,
  ])

  return (
    <TBSwiper
      items={badgesList}
      itemsScale={'0.7'}
      leftPadding={'0'}
      maxSlidesPerView={useSizeLG() ? 1 : 2}
      spaceBetween={8}
    />
  )
}
