import { Box, CircularProgress } from '@mui/material'

export const Spinner: React.FC<{ dimensions?: string; baseColor?: string }> = () => (
  <Box>
    <CircularProgress />
  </Box>
)
