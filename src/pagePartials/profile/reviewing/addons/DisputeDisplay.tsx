import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Tooltip, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import ExternalLink from '@/src/components/helpers/ExternalLink'
import { KLEROS_COURT_URL } from '@/src/constants/common'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
}))

const StyledTypography = styled(Typography)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px !important',
  '&:hover': {
    textDecoration: 'underline',
  },
}))

export default function DisputeDisplay({ disputeId }: { disputeId?: string }) {
  const { t } = useTranslation()

  if (!disputeId) return null
  return (
    <Container>
      <StyledTypography variant="body4">
        <ExternalLink
          href={`${KLEROS_COURT_URL}/cases/${disputeId}`}
          label={t('profile.user.badgesIAmReviewing.seeDispute')}
          showCopyButton={false}
          showExternalLink={false}
        />
      </StyledTypography>
      <Tooltip arrow title={t('profile.user.badgesIAmReviewing.seeDisputeTooltip')}>
        <InfoOutlinedIcon color="white" sx={{ ml: 1, width: '20px', height: '20px' }} />
      </Tooltip>
    </Container>
  )
}
