'use client'
import { Stack } from '@mui/material'

import { GeneralPageError } from '@/src/components/helpers/GeneralError'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Stack m={2}>
      <GeneralPageError error={error} resetErrorBoundary={reset} />
    </Stack>
  )
}
