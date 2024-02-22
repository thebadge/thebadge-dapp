import * as React from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import { Box, styled } from '@mui/material'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { HintContainer } from '@/src/components/form/formWithSteps/StepHeaderSubtitle'

const SubtitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  gap: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '5%',
    paddingRight: '5%',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
}))

const SubtitleTypography = styled(MarkdownTypography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export default function ModalSubtitle({
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
