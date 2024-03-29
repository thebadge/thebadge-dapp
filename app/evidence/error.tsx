'use client'
import { Stack } from '@mui/material'

import { GeneralPageError } from '@/src/components/helpers/GeneralError'
import ThemeProvider from '@/src/providers/themeProvider'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ThemeProvider>
      <Stack m={2}>
        <GeneralPageError error={error} resetErrorBoundary={reset} />
      </Stack>
    </ThemeProvider>
  )
}
