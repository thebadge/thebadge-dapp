import { Box, Skeleton, Stack } from '@mui/material'

import { InfoPreviewContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewContainer'

export const InfoPreviewSkeleton = () => {
  return (
    <InfoPreviewContainer>
      <Skeleton height={170} variant="circular" width={170} />
      <Stack flex="5" justifyContent="space-between" overflow="auto">
        <Stack gap={1}>
          <Skeleton height={30} variant="rounded" width={250} />
          <Skeleton height={15} variant="rounded" width={150} />
        </Stack>
        <Box display="flex" justifyContent="space-between">
          <Stack gap={1}>
            <Skeleton height={15} variant="rounded" width={350} />
            <Skeleton height={15} variant="rounded" width={300} />
            <Skeleton height={15} variant="rounded" width={200} />
          </Stack>
          <Stack gap={1}>
            <Skeleton height={15} variant="rounded" width={450} />
            <Skeleton height={15} variant="rounded" width={450} />
            <Skeleton height={15} variant="rounded" width={200} />
          </Stack>
        </Box>
      </Stack>
    </InfoPreviewContainer>
  )
}
