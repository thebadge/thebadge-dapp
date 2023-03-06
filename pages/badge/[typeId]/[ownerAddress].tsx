import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Box, Button, Stack, Tooltip } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeOwnedPreview from '@/src/pagePartials/badge/preview/BadgeOwnedPreview'
import { useChallengeProvider } from '@/src/providers/challengeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()
  const { challenge } = useChallengeProvider()
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
            <span>
              <Button
                color="purple"
                disabled={address === ownerAddress}
                onClick={() => router.push(`/badge/mint/${typeId}`)}
                sx={{ borderRadius: 3, fontSize: '11px !important' }}
              >
                Apply for it
              </Button>
            </span>
          </Tooltip>

          <Button
            color="error"
            onClick={() => challenge(typeId, ownerAddress)}
            sx={{ borderRadius: 3, fontSize: '11px !important' }}
            variant="contained"
          >
            Challenge
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
