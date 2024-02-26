import Link from 'next/link'
import React from 'react'

import { Stack, Typography } from '@mui/material'

import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useSizeSM } from '@/src/hooks/useSize'
import { capitalizeFirstLetter } from '@/src/utils/strings'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function BadgeNetwork() {
  const { badgeId, contract } = useBadgeIdParam()
  const { getExplorerUrl } = useWeb3Connection()
  const isMobile = useSizeSM()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeById = useBadgeById(badgeId, contract)

  const badge = badgeById.data

  const badgeLinkUrl = badge?.claimedTxHash
    ? getExplorerUrl(badge?.claimedTxHash)
    : getExplorerUrl(badge?.createdTxHash)

  return (
    <Stack gap={isMobile ? 1 : 3}>
      <Typography textAlign={isMobile ? 'center' : 'left'} variant="labelLarge">
        {`Network: `}
        <Link href={badgeLinkUrl} target={'_blank'}>
          <strong>{capitalizeFirstLetter(badge?.networkName || 'Sepolia')}</strong>
        </Link>
      </Typography>
    </Stack>
  )
}
