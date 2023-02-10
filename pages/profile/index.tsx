import { useRouter } from 'next/router'

import { Stack, Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { NextPageWithLayout } from '@/types/next'

const Profile: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()
  const router = useRouter()

  if (address) {
    router.replace(`/profile/${address}`)
    return null
  }

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography textAlign="center" variant="subtitle2">
          Please connect your wallet
        </Typography>
      </Stack>
    </>
  )
}

export default withPageGenericSuspense(Profile)
