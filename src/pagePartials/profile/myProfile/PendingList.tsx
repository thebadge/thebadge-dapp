import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { Box, Tooltip } from '@mui/material'
import { ButtonV2, EmptyBadgePreview, PendingBadgeOverlay, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useBadgeClaim from '@/src/hooks/theBadge/useBadgeClaim'
import useBadgeHelpers, { ReviewBadge } from '@/src/hooks/theBadge/useBadgeHelpers'
import { useSizeLG } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useProfileProvider } from '@/src/providers/ProfileProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'

export default function PendingList() {
  const { t } = useTranslation()
  const router = useRouter()
  const gql = useSubgraph()
  const { refreshWatcher } = useProfileProvider()
  const { getBadgeReviewStatus } = useBadgeHelpers()
  const { address: ownerAddress, appChainId } = useWeb3Connection()
  const handleClaimBadge = useBadgeClaim()

  const { mutate, ...badgesInReview } = gql.useUserBadgesInReview({
    ownerAddress: ownerAddress || '',
  })

  useEffect(() => {
    mutate()
  }, [mutate, refreshWatcher])

  const badgesList = useMemo(() => {
    const badges = badgesInReview.data?.user?.badges?.map((badge) => {
      const { reviewProgressPercentage, reviewTimeFinished, reviewTimeLeft } = getBadgeReviewStatus(
        badge as ReviewBadge,
      )

      return (
        <Box key={badge.id} sx={{ height: '100%', display: 'flex' }}>
          <InViewPort color={'green'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'green'}>
              <Box sx={{ width: 'fit-content' }}>
                <Box
                  onClick={() =>
                    router.push(
                      generateBadgePreviewUrl(badge.id, {
                        theBadgeContractAddress: badge.contractAddress,
                        connectedChainId: appChainId,
                      }),
                    )
                  }
                  sx={{ cursor: 'pointer' }}
                >
                  <PendingBadgeOverlay
                    badge={<BadgeModelPreview metadata={badge.badgeModel?.uri} size="small" />}
                    percentage={reviewProgressPercentage}
                    timeLeft={reviewTimeLeft}
                  />
                </Box>
                <Tooltip
                  arrow
                  title={!reviewTimeFinished ? t('badge.claimButtonDisabledTooltip') : ''}
                >
                  <div>
                    <ButtonV2
                      backgroundColor={colors.blue}
                      disabled={!reviewTimeFinished}
                      fontColor={colors.white}
                      onClick={() => handleClaimBadge(badge.id)}
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
                      {t('badge.claimButton')}
                    </ButtonV2>
                  </div>
                </Tooltip>
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
      2,
    )
  }, [
    badgesInReview.data?.user?.badges,
    getBadgeReviewStatus,
    t,
    router,
    handleClaimBadge,
    appChainId,
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
