import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal, styled } from '@mui/material'
import { gradients } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'

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

type TBModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  closeButtonAriaLabel?: string
}

export default function TBModal({ children, closeButtonAriaLabel, onClose, open }: TBModalProps) {
  return (
    <Modal aria-label="tbmodal-title" onClose={onClose} open={open}>
      <Box>
        <RequiredConnection noCloseButton>
          <ModalBody>
            <IconButton
              aria-label={closeButtonAriaLabel}
              color="secondary"
              component="label"
              onClick={onClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon color="white" />
            </IconButton>

            <SafeSuspense>{children}</SafeSuspense>
          </ModalBody>
        </RequiredConnection>
      </Box>
    </Modal>
  )
}
