import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { EmptyBadgePreview, TimeToExpireBadgeOverlay } from '@thebadge/ui-library'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { TimeLeft, useDate } from '@/src/hooks/useDate'
import { useSizeLG, useSizeMD } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const now = nowInSeconds()

export default function NearToExpireList() {
  const router = useRouter()
  const gql = useSubgraph()
  const md = useSizeMD()
  const lg = useSizeLG()
  const { getTimeLeft, timestampToDate } = useDate()
  const { address: ownerAddress } = useWeb3Connection()

  const badgesExpiringSoon = gql.useUserBadgesExpiringBetween({
    ownerAddress: ownerAddress || '',
    startDate: now,
    endDate: 1691238040,
  })

  const badgesList = useMemo(() => {
    const badges = badgesExpiringSoon.data?.user?.badges?.map((badge) => {
      // TODO get expiration date
      const expirationDate: Date = timestampToDate(badge.validFor)
      const timeLeft: TimeLeft = getTimeLeft(expirationDate)
      return (
        <Box
          key={badge.id}
          onClick={() => router.push(`/badge/preview/${badge.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <InViewPort color={'purple'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'purple'}>
              <TimeToExpireBadgeOverlay
                badge={<BadgeModelPreview metadata={badge.badgeModel?.uri} size="small" />}
                timeLeft={timeLeft}
              />
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 3)
  }, [badgesExpiringSoon.data?.user?.badges, timestampToDate, getTimeLeft, router])

  const amountItems = () => {
    if (md) {
      return 1
    } else if (lg) {
      return 2
    } else {
      return 3
    }
  }

  return (
    <TBSwiper
      items={badgesList}
      itemsScale={'0.7'}
      leftPadding={'0'}
      maxSlidesPerView={amountItems()}
      spaceBetween={8}
    />
  )
}
