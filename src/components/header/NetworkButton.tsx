import React from 'react'

import { Box, Tooltip, alpha } from '@mui/material'
import { SxProps } from '@mui/system'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function NetworkButton({ sx }: { sx?: SxProps }) {
  const { t } = useTranslation()

  const { isWalletNetworkSupported } = useWeb3Connection()

  return (
    <Tooltip
      title={isWalletNetworkSupported ? '' : t('errors.switchNetwork') + t('errors.toUseTheApp')}
    >
      <Box
        borderRadius={20}
        ml={2}
        sx={{
          '& > *': { transform: 'scale(0.8)' },
          backgroundColor: isWalletNetworkSupported ? 'transparent' : alpha(colors.redError, 0.2),
          ...sx,
        }}
      >
        <w3m-network-button />
      </Box>
    </Tooltip>
  )
}
