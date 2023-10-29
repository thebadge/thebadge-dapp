import { useRouter } from 'next/navigation'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { PauseAnimated } from '@/src/components/assets/animated/PauseAnimated'
import ModalSubtitle from '@/src/components/modal/ModalSubtitle'
import { DISCORD_URL } from '@/src/constants/common'
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

type ClaimUUIDIsInvalidProps = {
  creatorContact: string
}

export default function ClaimUUIDIsInvalid({ creatorContact }: ClaimUUIDIsInvalidProps) {
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
        <Typography align="center" color={colors.green} mt={4} variant="dAppHeadline2">
          {t('errors.claimUUIDInvalid')}
        </Typography>
        <ModalSubtitle
          hint={''}
          showHint={false}
          subTitle={t(`errors.claimUUIDInvalidSubtitle`, {
            creatorContact,
            discordUrl: DISCORD_URL,
          })}
        />
      </Stack>
    </ModalBody>
  )
}
