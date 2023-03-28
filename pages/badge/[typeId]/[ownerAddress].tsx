import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Box, Stack, Tooltip } from '@mui/material'
import { ButtonV2, colors } from 'thebadge-ui-library'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import ChallengeStatus from '@/src/pagePartials/badge/preview/ChallengeStatus'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
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
        <Box display="flex" justifyContent="space-between">
          <Tooltip title={address === ownerAddress ? 'You already own this badge.' : ''}>
            <span>
              <ButtonV2
                backgroundColor={colors.purple}
                disabled={address === ownerAddress}
                fontColor={colors.white}
                onClick={() => router.push(`/badge/mint/${typeId}`)}
              >
                Apply for it
              </ButtonV2>
            </span>
          </Tooltip>

          <ButtonV2
            backgroundColor={colors.blue}
            disabled={address === ownerAddress}
            fontColor={colors.white}
            onClick={() => curate(typeId, ownerAddress)}
          >
            Curate
          </ButtonV2>
        </Box>
        <SafeSuspense>
          <ChallengeStatus />
        </SafeSuspense>
      </Stack>
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
