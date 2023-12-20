import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { IconDiscord } from '@thebadge/ui-library'

import TBUserAvatar from '@/src/components/common/TBUserAvatar'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { WCAddress } from '@/types/utils'

type Props = {
  address: WCAddress
}

export default function InfoPreviewRead({ address }: Props) {
  const userResponse = useUserById(address)
  const user = userResponse.data
  const userMetadata = useUserMetadata(address, user?.metadataUri || '')
  const hasCustomProfileData = !!userMetadata

  return (
    <>
      <SafeSuspense fallback={<Skeleton variant="circular" width={userMetadata ? 171 : 90} />}>
        <TBUserAvatar size={hasCustomProfileData ? 170 : 90} src={userMetadata.logo.s3Url} />
      </SafeSuspense>
      <Stack flex="5" justifyContent="space-between" overflow="auto">
        <Stack gap={1}>
          <Typography variant="dAppHeadline2">{userMetadata?.name}</Typography>
          <Address address={address || (user?.id as WCAddress) || '0x'} truncate={false} />
        </Stack>
        {hasCustomProfileData && (
          <Box display="flex">
            <Stack flex="1" gap={2} height="100%" justifyContent="space-evenly" overflow="auto">
              {userMetadata?.email && (
                <Typography variant="dAppTitle2">
                  <EmailOutlinedIcon sx={{ mr: 1 }} />
                  {userMetadata?.email}
                </Typography>
              )}
              {userMetadata?.twitter && (
                <Typography variant="dAppTitle2">
                  <TwitterIcon sx={{ mr: 1 }} />
                  {userMetadata?.twitter}
                </Typography>
              )}
              {userMetadata?.discord && (
                <Typography variant="dAppTitle2">
                  <IconDiscord sx={{ mr: 1 }} />
                  {userMetadata?.discord}
                </Typography>
              )}
            </Stack>
            <Stack
              borderLeft="1px solid white"
              flex="1"
              height="100%"
              justifyContent="flex-end"
              overflow="auto"
              p={2}
            >
              <Typography variant="body4">{userMetadata?.description}</Typography>
            </Stack>
          </Box>
        )}
      </Stack>
    </>
  )
}
