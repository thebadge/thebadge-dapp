import { useRouter } from 'next/navigation'

import { Box, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from '@thebadge/ui-library'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import BadgeOwnerPreview from '@/src/pagePartials/badge/preview/BadgeOwnerPreview'
import ChallengeStatus from '@/src/pagePartials/badge/preview/ChallengeStatus'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BadgeStatus } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { curate } = useCurateProvider()
  const router = useRouter()
  const { mode } = useColorMode()

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

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack maxWidth={900} mx={'auto'}>
        <BadgeOwnedPreview />
        <Box display="flex" gap={8}>
          <Box
            alignItems="center"
            display="flex"
            flex="1"
            justifyContent="space-evenly"
            maxWidth={300}
          >
            <Tooltip arrow title={address === ownerAddress ? 'You already own this badge.' : ''}>
              <div>
                <ButtonV2
                  backgroundColor={colors.transparent}
                  disabled={address === ownerAddress}
                  fontColor={mode === 'light' ? colors.blackText : colors.white}
                  onClick={() => router.push(`/badge/mint/${badgeModelId}`)}
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
              </div>
            </Tooltip>
            <ButtonV2
              backgroundColor={colors.greenLogo}
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
          </Box>
          <SafeSuspense>
            <BadgeOwnerPreview ownerAddress={ownerAddress} />
          </SafeSuspense>
        </Box>
        {badge.status === BadgeStatus.Challenged && (
          <SafeSuspense>
            <ChallengeStatus />
          </SafeSuspense>
        )}
      </Stack>
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
