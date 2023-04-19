import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Badge, Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { IconDiscord, colors } from 'thebadge-ui-library'

import { Address } from '@/src/components/helpers/Address'
import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import { APP_URL } from '@/src/constants/common'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
import { User } from '@/types/generated/subgraph'

export default function CreatorInfoSmallPreview({ creator }: { creator: User }) {
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(
    creator.creatorMetadata || '',
  )
  const creatorMetadata = resCreatorMetadata.data?.content

  /* Creator info */
  return (
    <Stack gap={2} mt={6}>
      <Typography color={colors.pink} textTransform="uppercase" variant="dAppTitle2">
        Crated By
      </Typography>

      <Stack>
        <Typography variant="dAppHeadline2">{creatorMetadata?.name}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Address address={creator.id} showCopyButton={false} showExternalLink={false} />
          <IconButton onClick={() => window.open(`${APP_URL}/profile/${creator.id}`, '_ blank')}>
            <OpenInNewOutlinedIcon />
          </IconButton>
        </Box>
      </Stack>

      <Box display="flex" gap={4} sx={{ my: 2 }}>
        <Badge
          badgeContent={
            <Tooltip title={'Verified user'}>
              <Box>
                <VerifiedCreator sx={{ width: '26px', height: '26px' }} />
              </Box>
            </Tooltip>
          }
          invisible={!creator.isVerified}
          overlap="circular"
        >
          <Avatar src={creatorMetadata?.logo?.s3Url} sx={{ width: 70, height: 70 }} />
        </Badge>
        <Stack flex="1" justifyContent="space-evenly">
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
      </Box>

      <Typography variant="dAppTitle2">{creatorMetadata?.description}</Typography>

      <Divider color={colors.white} />
    </Stack>
  )
}
