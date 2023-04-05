import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, IconButton, Modal, Stack, Typography, styled } from '@mui/material'
import { ButtonV2, colors, gradients } from 'thebadge-ui-library'

import { useColorMode } from '@/src/providers/themeProvider'
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

type ModalProps = {
  open: boolean
  onClose: () => void
}
export default function AlreadyOwnThisBadgeErrorModal({ onClose, open }: ModalProps) {
  const { mode } = useColorMode()
  const router = useRouter()
  const { address } = useWeb3Connection()

  const badgeTypeId = router.query.typeId as string

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
            <Typography color={colors.green} variant="dAppHeadline2">
              <ReportProblemOutlinedIcon />
              You already own this badge
            </Typography>
          </Stack>
          <ButtonV2
            backgroundColor={colors.transparent}
            fontColor={mode === 'light' ? colors.blackText : colors.white}
            onClick={() => {
              router.push(`/badge/${badgeTypeId}/${address}`).then(() => onClose())
            }}
            sx={{
              borderRadius: '10px',
              fontSize: '14px !important',
            }}
          >
            Go to it
          </ButtonV2>
        </Stack>
      </ModalBody>
    </Modal>
  )
}
