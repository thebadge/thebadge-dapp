import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box, Tooltip } from '@mui/material'
import { ButtonV2, EmptyBadgePreview, PendingBadgeOverlay, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TimeLeft, useDate } from '@/src/hooks/useDate'
import { useSizeLG } from '@/src/hooks/useSize'
import useTransaction from '@/src/hooks/useTransaction'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { KlerosBadgeModelController__factory } from '@/types/generated/typechain'

export default function PendingList() {
  const { t } = useTranslation()
  const { sendTx } = useTransaction()
  const router = useRouter()
  const gql = useSubgraph()
  const { getPendingTimeProgressPercentage, getTimeLeft, timestampToDate } = useDate()
  const { address: ownerAddress } = useWeb3Connection()
  const badgesInReviewAndChallenged = gql.useUserBadgesInReview({
    ownerAddress: ownerAddress || '',
  })
  const klerosBadgeModelController = useContractInstance(
    KlerosBadgeModelController__factory,
    'KlerosBadgeModelController',
  )

  const badgesList = useMemo(() => {
    const badges = badgesInReviewAndChallenged.data?.user?.badges?.map((badge) => {
      const dueDate: Date = timestampToDate(badge.badgeKlerosMetaData?.reviewDueDate)
      const pendingTimeDurationSeconds: number =
        badge.badgeModel.badgeModelKleros?.challengePeriodDuration
      const timeLeft: TimeLeft = getTimeLeft(dueDate)
      const progressPercentage = getPendingTimeProgressPercentage(
        dueDate,
        pendingTimeDurationSeconds,
      )

      async function handleClaimBadge(badgeId: string) {
        const transaction = await sendTx(() => klerosBadgeModelController.claim(badgeId))
        if (transaction) {
          await transaction.wait()
        }
      }

      return (
        <Box key={badge.id} sx={{ height: '100%', display: 'flex' }}>
          <InViewPort color={'green'} minHeight={220} minWidth={140}>
            <SafeSuspense color={'green'}>
              <Box sx={{ width: 'fit-content' }}>
                <Box
                  onClick={() => router.push(`/badge/preview/${badge.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <PendingBadgeOverlay
                    badge={<BadgeModelPreview metadata={badge.badgeModel?.uri} size="small" />}
                    percentage={progressPercentage}
                    timeLeft={timeLeft}
                  />
                </Box>
                <Tooltip
                  arrow
                  title={progressPercentage < 100 ? t('badge.claimButtonDisabledTooltip') : ''}
                >
                  <div>
                    <ButtonV2
                      backgroundColor={colors.blue}
                      disabled={progressPercentage < 100}
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
    badgesInReviewAndChallenged.data?.user?.badges,
    getPendingTimeProgressPercentage,
    getTimeLeft,
    klerosBadgeModelController,
    router,
    sendTx,
    t,
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
