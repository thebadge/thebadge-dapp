import React from 'react'

import { Box, Stack, styled } from '@mui/material'
import Sticky from 'react-sticky-el'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { SpinnerColors } from '@/src/components/loading/Spinner'

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 3,
  [theme.breakpoints.down(770)]: {
    flex: 1.5,
  },
}))

const ItemsGridBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  margin: 'auto',
}))

export default function FilteredListDesktopView(props: {
  loading?: boolean
  loadingColor?: SpinnerColors
  preview: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Box display="flex" id="preview" mt={4}>
      <ContentBox>
        {props.loading ? (
          <Loading color={props.loadingColor} />
        ) : (
          <ItemsGridBox sx={{ justifyContent: props.preview ? 'left' : 'center' }}>
            <SafeSuspense>{props.children}</SafeSuspense>
          </ItemsGridBox>
        )}
      </ContentBox>
      {props.preview && (
        <Stack flex="2" overflow="hidden">
          <Sticky boundaryElement="#preview">{props.preview}</Sticky>
        </Stack>
      )}
    </Box>
  )
}
