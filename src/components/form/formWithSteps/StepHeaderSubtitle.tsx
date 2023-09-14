import * as React from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import { Box, styled } from '@mui/material'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'

const SubtitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  gap: theme.spacing(8),
  paddingLeft: '10%',
  paddingRight: '10%',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '5%',
    paddingRight: '5%',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
}))

const HintContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  gap: theme.spacing(2),
  border: '1px solid grey',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  margin: 'auto',
}))

const SubtitleTypography = styled(MarkdownTypography)(({ theme }) => ({
  width: '65%',
  textAlign: 'justify',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export default function StepHeaderSubtitle({
  hint,
  showHint = true,
  subTitle,
}: {
  hint: string
  subTitle: string
  showHint?: boolean
}) {
  return (
    <SubtitleContainer>
      <SubtitleTypography variant="body2">{subTitle}</SubtitleTypography>

      {showHint && hint && (
        <HintContainer>
          <TipsAndUpdatesOutlinedIcon color="info" />
          <MarkdownTypography variant="caption">{hint}</MarkdownTypography>
        </HintContainer>
      )}
    </SubtitleContainer>
  )
}
