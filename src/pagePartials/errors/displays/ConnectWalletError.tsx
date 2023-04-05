import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from 'thebadge-ui-library'

import ConnectWalletButton from '@/src/components/header/ConnectWalletButton'
import Wallet from '@/src/components/icons/Wallet'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
  boxShadow: `0px 0px 20px rgba(255, 255, 255, 0.6)`,
  padding: theme.spacing(4),
  '& .MuiContainer-root': {
    maxWidth: '100%',
  },
}))

export default function ConnectWalletError({ noCloseButton }: { noCloseButton?: boolean }) {
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
            router.push('/')
          }}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon color="white" />
        </IconButton>
      )}

      <Stack alignItems="center" gap={3} justifyContent="center" m="auto">
        <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
          <Wallet sx={{ width: '118px', height: '118px' }} />
          <Typography color={colors.green} variant="dAppHeadline2">
            <ReportProblemOutlinedIcon />
            Connect your wallet
          </Typography>
          <Typography variant="body4">
            Please, to continue it is necessary that you connect your wallet.
          </Typography>
        </Stack>
        <ConnectWalletButton onClick={connectWallet}>Connect wallet</ConnectWalletButton>
      </Stack>
    </ModalBody>
  )
}
