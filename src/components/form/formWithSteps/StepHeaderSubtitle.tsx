import * as React from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import { Box, styled } from '@mui/material'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'

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
    <Box display="flex" flex="1" gap={8} px="10%">
      <MarkdownTypography textAlign="justify" variant="body2" width="65%">
        {subTitle}
      </MarkdownTypography>

      {showHint && hint && (
        <HintContainer>
          <TipsAndUpdatesOutlinedIcon color="info" />
          <MarkdownTypography variant="caption">{hint}</MarkdownTypography>
        </HintContainer>
      )}
    </Box>
  )
}
