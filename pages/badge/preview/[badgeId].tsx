import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useBadge, { ReviewBadge } from '@/src/hooks/theBadge/useBadge'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import BadgeOwnerPreview from '@/src/pagePartials/badge/preview/BadgeOwnerPreview'
import BadgeStatusAndEvidence from '@/src/pagePartials/badge/preview/BadgeStatusAndEvidence'
import ChallengedStatusLogo from '@/src/pagePartials/badge/preview/addons/ChallengedStatusLogo'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateMintUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeStatus } from '@/types/generated/subgraph'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { sendTx } = useTransaction()
  const { curate } = useCurateProvider()
  const { getBadgeReviewStatus } = useBadge()
  const router = useRouter()
  const { mode } = useColorMode()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const isMobile = useSizeSM()

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

  async function handleClaimBadge(badgeId: string) {
    const transaction = await sendTx(() => theBadge.claim(badgeId, '0x'))
    if (transaction) {
      await transaction.wait()
    }
  }

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
              {/* Show mint button if this is not the own badge */}
            {address !== ownerAddress ? (
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
            ) : null}

              {/* Show curate button if this is not the own badge and its not already challenged */}
            {address !== ownerAddress && badgeStatus !== BadgeStatus.Challenged ? (
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
            ) : null}

            {/* Show claim button if it is an own badge, it has status requested and the review time finished */}
            {address === ownerAddress &&
            badgeStatus === BadgeStatus.Requested &&
            badgeReviewTimeFinished ? (
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
            ) : null}
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
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
