import React, { useState } from 'react'

import { Box, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { BadgeAnimatedLogo } from '@/src/components/assets/animated/BadgeAnimatedLogo'
import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { ToastComponent } from '@/src/components/toast/ToastComponent'

const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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

const CopyButton = styled('button')`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:active {
    opacity: 0.7;
  }
`

export default function OutOfService({ errorCode }: { errorCode: string }) {
  const { t } = useTranslation()
  const [toastId, setToastId] = useState('')

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (t: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={'Error code copied'} t={t} />
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    )
  }

  return (
    <ModalBody>
      <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
        <BadgeAnimatedLogo />
        <Typography color={colors.purple} variant="dAppHeadline2">
          {t('errors.outOfService')}
        </Typography>
        <Typography variant="body4">{t('errors.outOfServiceSubtitle')}</Typography>

        <Box display="flex" flexDirection="row" gap={1}>
          <MarkdownTypography variant="body2">
            {t('errors.outOfServiceErrorCode', { errorCode })}
          </MarkdownTypography>
          <CopyButton onClick={() => copyAddress(errorCode)}>
            <Copy />
          </CopyButton>
        </Box>
      </Stack>
    </ModalBody>
  )
}
