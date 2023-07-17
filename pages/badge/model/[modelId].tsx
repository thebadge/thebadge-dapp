import { Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { NextPageWithLayout } from '@/types/next'

const TypePreview: NextPageWithLayout = () => {
  const modelId = useModelIdParam()

  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can preview a badge model {modelId}
      </Typography>
    </>
  )
}

export default withPageGenericSuspense(TypePreview)
