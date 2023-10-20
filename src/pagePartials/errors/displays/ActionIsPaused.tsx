import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { PauseAnimated } from '@/src/components/assets/animated/PauseAnimated'
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
export default function ActionIsPaused() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <ModalBody>
      <IconButton
        aria-label="close paused action modal"
        color="secondary"
        component="label"
        onClick={() => router.push(generateBaseUrl())}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon color="white" />
      </IconButton>

      <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
        <PauseAnimated />
        <Typography color={colors.green} variant="dAppHeadline2">
          {t('errors.pausedAction')}
        </Typography>
        <Typography variant="body4">{t('errors.pausedActionSubtitle')}</Typography>
      </Stack>
    </ModalBody>
  )
}
