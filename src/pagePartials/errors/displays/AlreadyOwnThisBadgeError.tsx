import { useRouter } from 'next/router'
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
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

export default function AlreadyOwnThisBadgeError() {
  const { t } = useTranslation()
  const { mode } = useColorMode()
  const router = useRouter()
  const { address } = useWeb3Connection()

  const badgeTypeId = router.query.typeId as string

  return (
    <ModalBody>
      <IconButton
        aria-label="close you already own this badge modal"
        color="secondary"
        component="label"
        onClick={() => router.push(`/`)}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon color="white" />
      </IconButton>

      <Stack alignItems="center" gap={3} justifyContent="center" m="auto">
        <Stack alignItems="center" gap={1} justifyContent="center" m="auto">
          <Typography color={colors.green} variant="dAppHeadline2">
            <ReportProblemOutlinedIcon />
            {t('errors.alreadyOwnedBadge')}
          </Typography>
        </Stack>
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={mode === 'light' ? colors.blackText : colors.white}
          onClick={() => router.push(`/badge/${badgeTypeId}/${address}`)}
          sx={{
            borderRadius: '10px',
            fontSize: '14px !important',
          }}
        >
          Go to it
        </ButtonV2>
      </Stack>
    </ModalBody>
  )
}