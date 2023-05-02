import { useSearchParams } from 'next/navigation'

import { Box } from '@mui/material'

import { useUserById } from '@/src/hooks/subgraph/useUserById'

export default function BadgeOwnerPreview() {
  const searchParams = useSearchParams()
  const ownerAddress = searchParams.get('ownerAddress')

  if (!ownerAddress) {
    throw `No ownerAddress provided us URL query param`
  }

  const owner = useUserById(ownerAddress)

  return <Box></Box>
}
