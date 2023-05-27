import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { IconDiscord } from 'thebadge-ui-library'

import { Address } from '@/src/components/helpers/Address'
import { InfoPreviewContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewContainer'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function RegistrationInfoPreview({
  creatorMetadata,
  logoUri,
}: {
  logoUri: string
  creatorMetadata: CreatorMetadata
}) {
  const { address } = useWeb3Connection()
  return (
    <InfoPreviewContainer>
      <Avatar src={logoUri} sx={{ width: 170, height: 170 }} />
      <Stack flex="5" justifyContent="space-between" overflow="auto">
        <Stack gap={1}>
          <Typography variant="dAppHeadline2">{creatorMetadata?.name}</Typography>
          <Address address={address as string} showCopyButton={false} showExternalLink={false} />
        </Stack>
        <Box display="flex">
          <Stack flex="1" gap={2} height="100%" justifyContent="space-evenly" overflow="auto">
            <Typography variant="dAppTitle2">
              <EmailOutlinedIcon sx={{ mr: 1 }} />
              {creatorMetadata?.email}
            </Typography>
            {creatorMetadata?.twitter && (
              <Typography variant="dAppTitle2">
                <TwitterIcon sx={{ mr: 1 }} />
                {creatorMetadata?.twitter}
              </Typography>
            )}
            {creatorMetadata?.discord && (
              <Typography variant="dAppTitle2">
                <IconDiscord sx={{ mr: 1 }} />
                {creatorMetadata?.discord}
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
            <Typography variant="body4">{creatorMetadata?.description}</Typography>
          </Stack>
        </Box>
      </Stack>
    </InfoPreviewContainer>
  )
}
