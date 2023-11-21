import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import { ButtonV2, EmptyBadgePreview, TimeToExpireBadgeOverlay, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import { nowInSeconds, nowPlusOneMonthInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { TimeLeft, useDateHelpers } from '@/src/hooks/useDateHelpers'
import { useSizeLG, useSizeMD } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useProfileProvider } from '@/src/providers/ProfileProvider'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'

const now = nowInSeconds()
const nowPlusOneMonth = nowPlusOneMonthInSeconds()

export default function NearToExpireList() {
  const { t } = useTranslation()
  const router = useRouter()
  const gql = useSubgraph()
  const md = useSizeMD()
  const lg = useSizeLG()
  const { getTimeLeftToExpire, timestampToDate } = useDateHelpers()
  const { address: ownerAddress } = useWeb3Connection()
  const { refreshWatcher } = useProfileProvider()

  // TODO now "NEAR TO EXPIRE" is in max 1 month, we will change this to configurable time
  const { mutate, ...badgesExpiringSoon } = gql.useUserBadgesExpiringBetween({
    ownerAddress: ownerAddress || '',
    startDate: now,
    endDate: nowPlusOneMonth,
  })

  useEffect(() => {
    mutate()
  }, [mutate, refreshWatcher])

  const badgesList = useMemo(() => {
    const badges = badgesExpiringSoon.data?.user?.badges?.map((badge) => {
      const expirationDate: Date = timestampToDate(badge.validUntil)
      const timeLeft: TimeLeft = getTimeLeftToExpire(expirationDate)
      return (
        <Box key={badge.id} sx={{ height: '100%', display: 'flex' }}>
          <InViewPort color={'purple'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'purple'}>
              <Box sx={{ width: 'fit-content' }}>
                <Box
                  onClick={() => router.push(generateBadgePreviewUrl(badge.id))}
                  sx={{ cursor: 'pointer' }}
                >
                  <TimeToExpireBadgeOverlay
                    badge={<BadgeModelPreview metadata={badge.badgeModel?.uri} size="small" />}
                    timeLeft={timeLeft}
                  />
                </Box>
                <ButtonV2
                  backgroundColor={colors.purple}
                  fontColor={colors.white}
                  onClick={() => router.push(`/renew/${badge.id}`)}
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
                  {t('badge.renewButton')}
                </ButtonV2>
              </Box>
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
    // If there is no badges to show, we list 5 placeholders
    return fillListWithPlaceholders(
      badges,
      <div style={{ minHeight: '365px' }}>
        <EmptyBadgePreview size="small" />
      </div>,
      3,
    )
  }, [badgesExpiringSoon.data?.user?.badges, timestampToDate, getTimeLeftToExpire, t, router])

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
