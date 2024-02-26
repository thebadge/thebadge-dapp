import * as React from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import { Box, Typography, styled } from '@mui/material'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'

const SubtitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  gap: theme.spacing(10),
  paddingLeft: '10%',
  paddingRight: '10%',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '5%',
    paddingRight: '5%',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
}))

export const HintContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  gap: theme.spacing(2),
  border: '1px solid grey',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  margin: 'auto',
}))

const SubtitleTypography = styled(MarkdownTypography)(() => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'justify',
}))

const InnerContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  width: '60%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  gap: theme.spacing(2),
}))

const StepNumberTypography = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  height: '20px',
  width: '20px',
}))

export default function StepHeaderSubtitle({
  hint,
  showHint = true,
  stepNumber,
  subTitle,
}: {
  hint: string
  subTitle: string
  showHint?: boolean
  stepNumber?: number
}) {
  return (
    <SubtitleContainer>
      <InnerContainer>
        {stepNumber && (
          <StepNumberTypography>
            <Typography variant="labelMedium">{stepNumber}</Typography>
          </StepNumberTypography>
        )}
        <SubtitleTypography variant="labelMedium">{subTitle}</SubtitleTypography>
      </InnerContainer>

      {showHint && hint && (
        <HintContainer>
          <TipsAndUpdatesOutlinedIcon color="info" />
          <MarkdownTypography variant="caption">{hint}</MarkdownTypography>
        </HintContainer>
      )}
    </SubtitleContainer>
  )
}
