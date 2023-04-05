import { Box, CircularProgress } from '@mui/material'
import { CircularProgressPropsColorOverrides } from '@mui/material/CircularProgress/CircularProgress'
import { OverridableStringUnion } from '@mui/types'

export type SpinnerColors = OverridableStringUnion<
  'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit',
  CircularProgressPropsColorOverrides
>
export type SpinnerProps = {
  color?: SpinnerColors
}

export const Spinner: React.FC<SpinnerProps> = ({ color }: SpinnerProps) => (
  <Box>
    <CircularProgress color={color || 'primary'} />
  </Box>
)
