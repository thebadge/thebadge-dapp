import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'
import { Box, Tooltip, Typography, alpha, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { timeLeftTo, timeLeftToShort } from '@/src/utils/dateUtils'

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

export default function TimeLeftDisplay({
  reviewDueDate,
  smallView = false,
}: {
  reviewDueDate?: number
  smallView?: boolean
}) {
  const { t } = useTranslation()

  if (!reviewDueDate) return null
  if (smallView) {
    // Small view, to be used on curation list preview
    return (
      <Container sx={{ background: alpha(colors.darkBlue, 0.9), border: 'none' }}>
        <StyledTypography>
          <RestoreOutlinedIcon sx={{ mr: 0.5, width: '18px', height: '18px' }} />
          {timeLeftToShort(reviewDueDate)}
        </StyledTypography>
      </Container>
    )
  }
  return (
    <Container>
      <StyledTypography variant="body4">
        <RestoreOutlinedIcon sx={{ mr: 0.5, width: '18px', height: '18px' }} />
        {timeLeftTo(reviewDueDate)}
      </StyledTypography>
      <Tooltip arrow title={t('explorer.curate.timeLeft', { time: timeLeftTo(reviewDueDate) })}>
        <InfoOutlinedIcon color="white" sx={{ ml: 1, width: '20px', height: '20px' }} />
      </Tooltip>
    </Container>
  )
}
