import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors, gradients } from 'thebadge-ui-library'

import { BadgeAnimatedLogo } from '@/src/components/assets/animated/BadgeAnimatedLogo'
import { useSectionReferences } from '@/src/providers/referencesProvider'

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
export default function NotACreatorError() {
  const { t } = useTranslation()
  const router = useRouter()
  const { becomeACreatorSection, scrollTo } = useSectionReferences()

  return (
    <ModalBody>
      <IconButton
        aria-label="close not registered creator modal"
        color="secondary"
        component="label"
        onClick={() => router.push('/')}
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
            onClick={() => scrollTo('/', becomeACreatorSection)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {t('header.tooltips.becomeACreator.link')}
          </Box>
        </Typography>
      </Stack>
    </ModalBody>
  )
}
