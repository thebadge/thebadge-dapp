import { Button, ButtonProps, styled } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  borderRadius: theme.spacing(1),
}))
export default function ConnectWalletButton({ children, ...rest }: ButtonProps) {
  return (
    <StyledButton {...rest} color="secondary" variant="contained">
      {children}
    </StyledButton>
  )
}
