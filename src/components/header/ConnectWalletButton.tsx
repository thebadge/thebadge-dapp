import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import { ButtonProps, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'

import { useSizeSM } from '@/src/hooks/useSize'

export default function ConnectWalletButton({ children, ...rest }: ButtonProps) {
  const isMobile = useSizeSM()
  return (
    <ButtonV2
      {...rest}
      backgroundColor={colors.greenLogo}
      fontColor={colors.blackText}
      sx={{
        height: 32,
        borderRadius: '10px',
        ...(isMobile && { pl: 1.5, pr: 1.5 }),
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
