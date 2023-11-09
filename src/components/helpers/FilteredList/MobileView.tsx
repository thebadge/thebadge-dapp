import React from 'react'

import { Stack } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { SpinnerColors } from '@/src/components/loading/Spinner'

export default function FilteredListMobileView(props: {
  loading?: boolean
  loadingColor?: SpinnerColors
  preview: React.ReactNode
  items: React.ReactNode[]
}) {
  return (
    <Stack>
      <TBSwiper
        items={props.items}
        itemsScale={'0.7'}
        leftPadding={'0'}
        maxSlidesPerView={1}
        spaceBetween={8}
      />
      <SafeSuspense>{props.preview}</SafeSuspense>
    </Stack>
  )
}
