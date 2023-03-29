import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Box, Button, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { curate } = useCurateProvider()
  const router = useRouter()

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
        <Box display="flex" justifyContent="space-evenly" maxWidth={300}>
          <Tooltip title={address === ownerAddress ? 'You already own this badge.' : ''}>
            <Button
              color="white"
              disabled={address === ownerAddress}
              onClick={() => router.push(`/badge/mint/${typeId}`)}
              sx={{ borderRadius: 3, fontSize: '14px !important' }}
            >
              {t('badge.mintButton')}
            </Button>
          </Tooltip>
          <Button
            color="green"
            onClick={() => curate(typeId, ownerAddress)}
            sx={{ borderRadius: 3, fontSize: '14px !important', color: 'background.default' }}
            variant="contained"
          >
            {t('badge.curateButton')}
          </Button>
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
