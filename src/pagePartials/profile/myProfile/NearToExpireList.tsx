import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box, Tooltip } from '@mui/material'
import { ButtonV2, EmptyBadgePreview, TimeToExpireBadgeOverlay, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import { nowInSeconds, nowPlusOneMonthInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { TimeLeft, useDate } from '@/src/hooks/useDate'
import { useSizeLG, useSizeMD } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const now = nowInSeconds()
const nowPlusOneMonth = nowPlusOneMonthInSeconds()

export default function NearToExpireList() {
  const { t } = useTranslation()
  const router = useRouter()
  const gql = useSubgraph()
  const md = useSizeMD()
  const lg = useSizeLG()
  const { getTimeLeftToExpire, timestampToDate } = useDate()
  const { address: ownerAddress } = useWeb3Connection()

  const badgesExpiringSoon = gql.useUserBadgesExpiringBetween({
    ownerAddress: ownerAddress || '',
    startDate: now,
    endDate: nowPlusOneMonth,
  })

  const badgesList = useMemo(() => {
    const badges = badgesExpiringSoon.data?.user?.badges?.map((badge) => {
      const expirationDate: Date = timestampToDate(badge.validFor)
      const timeLeft: TimeLeft = getTimeLeftToExpire(expirationDate)
      return (
        <Box key={badge.id} sx={{ height: '100%', display: 'flex' }}>
          <InViewPort color={'purple'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'purple'}>
              <Box sx={{ width: 'fit-content' }}>
                <Box
                  onClick={() => router.push(`/badge/preview/${badge.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TimeToExpireBadgeOverlay
                    badge={<BadgeModelPreview metadata={badge.badgeModel?.uri} size="small" />}
                    timeLeft={timeLeft}
                  />
                </Box>
                <Tooltip arrow title={'Not available yet. Coming soon...'}>
                  <span>
                    <ButtonV2
                      backgroundColor={colors.purple}
                      disabled={true}
                      fontColor={colors.white}
                      sx={{
                        width: '100%',
                        height: 'fit-content !important',
                        marginTop: '1rem',
                        padding: '0.5rem 1rem !important',
                        borderRadius: '10px',
                        fontSize: '15px !important',
                        lineHeight: '15px',
                        fontWeight: 700,
                        boxShadow: 'none',
                        textTransform: 'uppercase',
                      }}
                      variant="contained"
                    >
                      {t('badge.mintAgainButton')}
                    </ButtonV2>
                  </span>
                </Tooltip>
              </Box>
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(badges, <EmptyBadgePreview size="small" />, 3)
  }, [badgesExpiringSoon.data?.user?.badges, timestampToDate, getTimeLeftToExpire, router])

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
