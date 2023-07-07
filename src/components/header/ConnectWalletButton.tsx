import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import { ButtonProps, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'

export default function ConnectWalletButton({ children, ...rest }: ButtonProps) {
  return (
    <ButtonV2
      {...rest}
      backgroundColor={colors.greenLogo}
      fontColor={colors.blackText}
      sx={{
        borderRadius: '10px',
      }}
    >
      <ElectricBoltIcon sx={{ width: '14px' }} />
      <Typography
        fontSize={'14px !important'}
        fontWeight={700}
        lineHeight={'14px'}
        textTransform={'uppercase'}
      >
        {children}
      </Typography>
    </ButtonV2>
  )
}
