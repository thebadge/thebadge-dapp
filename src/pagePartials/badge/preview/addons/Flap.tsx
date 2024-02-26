import { Box, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

const Flap = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  top: 0,
  right: 12,
  width: 80,
  height: 47,
  borderRadius: '0px 0px 5px 5px',
  zIndex: 100,
}))

const FlapText = styled(Typography)(() => ({
  margin: 'auto',
  textAlign: 'center',
  fontSize: '14px !important',
  fontWeight: 700,
  lineHeight: '22px',
  color: '#FFF',
}))

export default function FlapAdornment({
  color = colors.green,
  icon,
  label,
}: {
  color?: string
  label?: string | React.ReactNode
  icon?: React.ReactNode
}) {
  const isString = typeof label === 'string'
  return (
    <Flap sx={{ backgroundColor: color }}>
      {label && isString && <FlapText>{label}</FlapText>}
      {label && !isString && <Stack>{label}</Stack>}
      {icon && <Stack>{icon}</Stack>}
    </Flap>
  )
}
