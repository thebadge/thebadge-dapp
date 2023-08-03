import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Tooltip, Typography, alpha, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import ExternalLink from '@/src/components/helpers/ExternalLink'
import { KLEROS_COURT_URL } from '@/src/constants/common'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderRadius: theme.spacing(1),
  border: `0.5px solid ${theme.palette.error.main}`,
  background: alpha(theme.palette.error.main, 0.1),
  padding: theme.spacing(0.5, 1),
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px !important',
}))

export default function DisputeIdDisplay({ disputeId }: { disputeId?: string }) {
  const { t } = useTranslation()

  if (!disputeId) return null
  return (
    <Container>
      <StyledTypography variant="body4">
        <ExternalLink
          href={`${KLEROS_COURT_URL}/cases/${disputeId}`}
          label={disputeId}
          showCopyButton={false}
          showExternalLink={false}
        />
      </StyledTypography>
      <Tooltip arrow title={t('explorer.curate.disputeId')}>
        <InfoOutlinedIcon color="white" sx={{ ml: 1, width: '20px', height: '20px' }} />
      </Tooltip>
    </Container>
  )
}
