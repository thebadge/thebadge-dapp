import { useRouter } from 'next/navigation'

import { Button, Stack, Typography } from '@mui/material'
import { FallbackProps } from 'react-error-boundary'

export const GeneralError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <Typography>Oh no</Typography>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {error.message ? error.message : JSON.stringify(error)}
      </pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export const GeneralPageError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const router = useRouter()

  return (
    <div role="alert">
      <Typography>Oh no! 🙈</Typography>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {error.message ? error.message : JSON.stringify(error)}
      </pre>
      <Stack alignItems="flex-start" gap={1}>
        <Button color="green" onClick={resetErrorBoundary} sx={{ textTransform: 'none', p: 0 }}>
          Try again
        </Button>
        <Button onClick={() => router.back()} sx={{ textTransform: 'none', p: 0 }}>
          Click here to go back
        </Button>
        <Button onClick={() => router.replace('/')} sx={{ textTransform: 'none', p: 0 }}>
          Go to homepage
        </Button>
      </Stack>
    </div>
  )
}
