import { useSearchParams } from 'next/navigation'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { NextPageWithLayout } from '@/types/next'

const TypePreview: NextPageWithLayout = () => {
  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can preview a badge type {typeId}
      </Typography>
    </>
  )
}

TypePreview.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withPageGenericSuspense(TypePreview)
