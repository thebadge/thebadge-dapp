import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Box, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import BadgeOwnerPreview from '@/src/pagePartials/badge/preview/BadgeOwnerPreview'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { curate } = useCurateProvider()
  const router = useRouter()
  const { mode } = useColorMode()

  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  const ownerAddress = searchParams.get('ownerAddress')

  if (!typeId || !ownerAddress) {
    throw `No typeId/ownerAddress provided us URL query param`
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack maxWidth={900} mx={'auto'}>
        <BadgeOwnedPreview />
        <Box display="flex" id="btns" justifyContent="space-evenly" maxWidth={300}>
          <Tooltip arrow title={address === ownerAddress ? 'You already own this badge.' : ''}>
            <ButtonV2
              backgroundColor={colors.transparent}
              disabled={address === ownerAddress}
              fontColor={mode === 'light' ? colors.blackText : colors.white}
              onClick={() => router.push(`/badge/mint/${typeId}`)}
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
          </Tooltip>
          <ButtonV2
            backgroundColor={colors.greenLogo}
            fontColor={colors.blackText}
            onClick={() => curate(typeId, ownerAddress)}
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
          <BadgeOwnerPreview />
        </Box>
        {/*
        // TODO Enable it when we have the required data to show
        <SafeSuspense>
          <ChallengeStatus />
        </SafeSuspense>
        */}
      </Stack>
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
