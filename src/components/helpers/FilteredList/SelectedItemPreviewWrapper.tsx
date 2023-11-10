import React from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Typography } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useSizeSM } from '@/src/hooks/useSize'

type Props = {
  title: string
  color: string
  children: React.ReactNode
  onSelectNext: VoidFunction
  onSelectPrevious: VoidFunction
}

export default function SelectedItemPreviewWrapper({
  children,
  color,
  onSelectNext,
  onSelectPrevious,
  title,
}: Props) {
  const isMobile = useSizeSM()

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography color={color} mb={4} variant="dAppHeadline2">
          {title}
        </Typography>
        {!isMobile && (
          <Box>
            <IconButton onClick={onSelectPrevious}>
              <ArrowBackIosOutlinedIcon color="blue" />
            </IconButton>
            <IconButton onClick={onSelectNext}>
              <ArrowForwardIosOutlinedIcon color="blue" />
            </IconButton>
          </Box>
        )}
      </Box>
      <SafeSuspense>{children}</SafeSuspense>
    </>
  )
}
