import { useSearchParams } from 'next/navigation'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'

const TypePreview: NextPageWithLayout = () => {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')
  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Here you can preview a badge type {hash}
      </Typography>
    </>
  )
}

TypePreview.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default TypePreview
