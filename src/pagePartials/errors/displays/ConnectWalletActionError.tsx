import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { WalletAnimated } from '@/src/components/assets/animated/WalletAnimated'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function ConnectWalletActionError() {
  const { t } = useTranslation()
  const { connectWallet } = useWeb3Connection()

  return (
    <Box mt={2}>
      <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
        <Box alignItems="center" display="flex" justifyContent="space-evenly">
          <WalletAnimated sx={{ width: '45px', height: '45px' }} />
          <Typography color={colors.green} variant="dAppTitle3">
            {t('errors.connectWallet')}
          </Typography>
        </Box>
        <Typography
          onClick={() => connectWallet()}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          variant="body4"
        >
          {t('errors.connectWalletSubtitle')}
        </Typography>
      </Stack>
    </Box>
  )
}
