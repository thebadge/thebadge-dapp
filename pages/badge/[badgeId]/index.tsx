import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as React from 'react'

import { Box, Link, Stack, alpha } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useBadgeClaim from '@/src/hooks/theBadge/useBadgeClaim'
import useBadgeHelpers, { ReviewBadge } from '@/src/hooks/theBadge/useBadgeHelpers'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import BadgeOwnerPreview from '@/src/pagePartials/badge/preview/BadgeOwnerPreview'
import BadgeStatusAndEvidence from '@/src/pagePartials/badge/preview/BadgeStatusAndEvidence'
import ChallengedStatusLogo from '@/src/pagePartials/badge/preview/addons/ChallengedStatusLogo'
import ZKModal from '@/src/pagePartials/badge/preview/addons/ZKModal'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateMintUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeStatus } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { curate } = useCurateProvider()
  const { getBadgeReviewStatus } = useBadgeHelpers()
  const router = useRouter()
  const { mode } = useColorMode()
  const handleClaimBadge = useBadgeClaim()
  const isMobile = useSizeSM()

  const [openZKModal, setOpenZKModal] = useState(false)

  const badgeId = useBadgeIdParam()
  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeById = useBadgeById(badgeId)
  const badge = badgeById.data

  if (!badge) {
    throw 'There was not possible to get the needed data. Try again in some minutes.'
  }
  const badgeModelId = badge.badgeModel.id
  const ownerAddress = badge.account.id

  const { reviewTimeFinished: badgeReviewTimeFinished, status: badgeStatus } = getBadgeReviewStatus(
    badge as ReviewBadge,
  )

  // Show mint button if this is not the own badge
  const showMintButton = address !== ownerAddress

  // Show curate button if this is not the own badge and its not already challenged */
  const showCurateButton = address !== ownerAddress && badgeStatus !== BadgeStatus.Challenged

  // Show claim button if it is an own badge, it has status requested and the review time finished
  const showClaimButton =
    address === ownerAddress && badgeStatus === BadgeStatus.Requested && badgeReviewTimeFinished

  const showZKButton =
    address === ownerAddress && badgeReviewTimeFinished && badgeStatus === BadgeStatus.Approved

  const handleCloseZK = () => setOpenZKModal(false)

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack maxWidth={900} mx={'auto'}>
        {badge?.status === BadgeStatus.Challenged && <ChallengedStatusLogo />}
        <BadgeOwnedPreview />
        <Box display="flex" gap={8}>
          {!isMobile && (
            <Box
              alignItems="center"
              display="flex"
              flex="1"
              justifyContent="space-between"
              maxWidth={300}
            >
              {showMintButton && (
                <ButtonV2
                  backgroundColor={colors.transparent}
                  disabled={address === ownerAddress}
                  fontColor={mode === 'light' ? colors.blackText : colors.white}
                  onClick={() =>
                    router.push(generateMintUrl(badge?.badgeModel.controllerType, badgeModelId))
                  }
                  sx={{
                    borderRadius: '10px',
                    fontSize: '11px !important',
                    padding: '0.5rem 1rem !important',
                    height: 'fit-content !important',
                    lineHeight: '14px',
                    fontWeight: 700,
                    boxShadow: 'none',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('badge.mintButton')}
                </ButtonV2>
              )}

              {showCurateButton && (
                <ButtonV2
                  backgroundColor={colors.greenLogo}
                  disabled={address === ownerAddress}
                  fontColor={colors.blackText}
                  onClick={() => curate(badgeId)}
                  sx={{
                    borderRadius: '10px',
                    fontSize: '11px !important',
                    padding: '0.5rem 1rem !important',
                    height: 'fit-content !important',
                    lineHeight: '14px',
                    fontWeight: 700,
                    boxShadow: 'none',
                    textTransform: 'uppercase',
                  }}
                  variant="contained"
                >
                  {t('badge.curateButton')}
                </ButtonV2>
              )}

              {showClaimButton && (
                <ButtonV2
                  backgroundColor={colors.blue}
                  disabled={!badgeReviewTimeFinished}
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
              )}

              {showZKButton && (
                <Stack flex={1} gap={1}>
                  <ButtonV2
                    backgroundColor="transparent"
                    color="blue"
                    disabled={!badgeReviewTimeFinished}
                    fontColor={colors.white}
                    onClick={() => setOpenZKModal(true)}
                    sx={{
                      width: '100%',
                      height: 'fit-content !important',
                      padding: '0.5rem 1rem !important',
                      borderRadius: '16px',
                      fontSize: '15px !important',
                      lineHeight: '15px',
                      fontWeight: 700,
                      border: `1px solid ${alpha(colors.blue, 0.8)}`,
                      boxShadow: `0px 0px 4px ${alpha(colors.blue, 0.9)}`,
                    }}
                    variant="outlined"
                  >
                    Mint ZK Badge
                  </ButtonV2>
                  <Link
                    color="white"
                    sx={{ cursor: 'pointer', width: 'fit-content' }}
                    target="_blank"
                    underline="hover"
                    variant="labelSmall"
                  >
                    Powered by ALEO
                  </Link>
                </Stack>
              )}
            </Box>
          )}
          <SafeSuspense>
            <BadgeOwnerPreview ownerAddress={ownerAddress} />
          </SafeSuspense>
        </Box>
        <SafeSuspense>
          <BadgeStatusAndEvidence />
        </SafeSuspense>
      </Stack>
      {openZKModal && (
        <ZKModal
          badgeId={badgeId}
          badgeModelId={badgeModelId}
          onClose={handleCloseZK}
          open={openZKModal}
        />
      )}
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
