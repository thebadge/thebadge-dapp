import Image from 'next/image'

import { Box } from '@mui/material'

import challengedLogo from '@/src/components/assets/challenged.webp'
import { useSizeSM } from '@/src/hooks/useSize'

export default function ChallengedStatusLogo() {
  const isMobile = useSizeSM()

  return (
    <Box
      sx={{
        position: 'absolute',
        right: isMobile ? -10 : 0,
        top: -10,
        width: isMobile ? '125px' : '150px',
        cursor: 'pointer',
      }}
    >
      <Image alt="Challenged badge" src={challengedLogo} />
    </Box>
  )
}
