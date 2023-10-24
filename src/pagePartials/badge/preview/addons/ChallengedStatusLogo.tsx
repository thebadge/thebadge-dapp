import Image from 'next/image'

import { Box } from '@mui/material'

import challengedLogo from '@/src/components/assets/challenged.webp'

export default function ChallengedStatusLogo() {
  return (
    <Box sx={{ position: 'absolute', right: 0, top: -10, width: '150px', cursor: 'pointer' }}>
      <Image alt="Challenged badge" src={challengedLogo} />
    </Box>
  )
}
