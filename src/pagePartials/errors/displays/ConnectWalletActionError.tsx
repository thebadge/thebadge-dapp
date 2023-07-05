import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from '@thebadge/ui-library'

import { WalletAnimated } from '@/src/components/assets/animated/WalletAnimated'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
          onClick={connectWallet}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          variant="body4"
        >
          {t('errors.connectWalletSubtitle')}
        </Typography>
      </Stack>
    </Box>
  )
}
