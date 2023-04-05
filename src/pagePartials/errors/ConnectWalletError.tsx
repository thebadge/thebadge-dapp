import React, { useEffect } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, IconButton, Modal, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from 'thebadge-ui-library'

import ConnectWalletButton from '@/src/components/header/ConnectWalletButton'
import Wallet from '@/src/components/icons/Wallet'
import { useErrorsProvider } from '@/src/providers/useErrorsProvider'
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

type ConnectWalletErrorModalProps = {
  open: boolean
  onClose: () => void
}
export default function ConnectWalletErrorModal({ onClose, open }: ConnectWalletErrorModalProps) {
  const { connectWalletErrorSolved } = useErrorsProvider()
  const { connectWallet, isWalletConnected } = useWeb3Connection()

  useEffect(() => {
    if (isWalletConnected) connectWalletErrorSolved()
  }, [connectWalletErrorSolved, isWalletConnected])

  function handleClick() {
    connectWallet()
    // We need to close this error modal, if not the user won't be able to see the "connect modal".
    connectWalletErrorSolved()
  }

  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      onClose={onClose}
      open={open}
    >
      <ModalBody>
        <IconButton
          aria-label="close curate modal"
          color="secondary"
          component="label"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon color="white" />
        </IconButton>

        <Stack alignItems="center" gap={3} justifyContent="center" m="auto">
          <Stack alignItems="center" justifyContent="center" m="auto">
            <Wallet sx={{ width: '118px', height: '118px' }} />
            <Typography color={colors.green} variant="dAppHeadline2">
              <ReportProblemOutlinedIcon />
              Connect your wallet
            </Typography>
            <Typography variant="body4">
              Please, to continue it is necessary that you connect your wallet.
            </Typography>
          </Stack>
          <ConnectWalletButton onClick={handleClick}>Connect wallet</ConnectWalletButton>
        </Stack>
      </ModalBody>
    </Modal>
  )
}
