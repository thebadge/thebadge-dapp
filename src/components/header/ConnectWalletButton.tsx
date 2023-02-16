import { Button, ButtonProps, styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: colors.black,
  borderRadius: theme.spacing(1),
}))
export default function ConnectWalletButton({ children, ...rest }: ButtonProps) {
  return (
    <StyledButton {...rest} color="secondary" variant="contained">
      {children}
    </StyledButton>
  )
}
