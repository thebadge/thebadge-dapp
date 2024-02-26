import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { WalletAnimated } from '@/src/components/assets/animated/WalletAnimated'
import ConnectWalletButton from '@/src/components/header/ConnectWalletButton'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { generateBaseUrl } from '@/src/utils/navigation/generateUrl'

const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxWidth: '850px',
  minHeight: '50%',
  background:
    theme.palette.mode === 'light'
      ? gradients.gradientBackgroundLight
      : gradients.gradientBackgroundDark,
  borderRadius: theme.spacing(1),
  boxShadow: `0px 0px 15px rgba(255, 255, 255, 0.4)`,
  padding: theme.spacing(4),
  '& .MuiContainer-root': {
    maxWidth: '100%',
  },
}))

export default function ConnectWalletError({ noCloseButton }: { noCloseButton?: boolean }) {
  const { t } = useTranslation()
  const { connectWallet } = useWeb3Connection()
  const router = useRouter()

  return (
    <ModalBody>
      {!noCloseButton && (
        <IconButton
          aria-label="close connect your wallet modal"
          color="secondary"
          component="label"
          onClick={() => {
            router.push(generateBaseUrl())
          }}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon color="white" />
        </IconButton>
      )}

      <Stack alignItems="center" gap={3} justifyContent="center" m="auto">
        <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
          <WalletAnimated sx={{ width: '135px', height: '135px' }} />
          <Typography color={colors.green} variant="dAppHeadline2">
            <ReportProblemOutlinedIcon />
            {t('errors.connectWallet')}
          </Typography>
          <Typography variant="body4">{t('errors.connectWalletSubtitle')}</Typography>
        </Stack>
        <ConnectWalletButton onClick={() => connectWallet()}>
          {t('header.wallet.connect')}
        </ConnectWalletButton>
      </Stack>
    </ModalBody>
  )
}
