import { useRouter } from 'next/navigation'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { BadgeAnimatedLogo } from '@/src/components/assets/animated/BadgeAnimatedLogo'
import { generateBaseUrl, generateCreatorRegisterUrl } from '@/src/utils/navigation/generateUrl'

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
export default function NotACreatorError() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <ModalBody>
      <IconButton
        aria-label="close not registered creator modal"
        color="secondary"
        component="label"
        onClick={() => router.push(generateBaseUrl())}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon color="white" />
      </IconButton>

      <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
        <BadgeAnimatedLogo />
        <Typography color={colors.purple} variant="dAppHeadline2">
          {t('errors.notACreator')}
        </Typography>
        <Typography variant="body4">
          {t('errors.notACreatorSubtitle')}
          <Box
            component="span"
            onClick={() => router.push(generateCreatorRegisterUrl())}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {t('header.tooltips.becomeACreator.link')}
          </Box>
        </Typography>
      </Stack>
    </ModalBody>
  )
}
