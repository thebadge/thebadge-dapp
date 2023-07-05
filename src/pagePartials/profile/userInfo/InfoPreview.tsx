import React from 'react'

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Badge, Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { IconDiscord } from '@thebadge/ui-library'

import { Address } from '@/src/components/helpers/Address'
import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { InfoPreviewContainer } from '@/src/pagePartials/profile/userInfo/InfoPreviewContainer'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { CreatorMetadata } from '@/types/badges/Creator'

type Props = {
  address: string
}
export default function InfoPreview({ address }: Props) {
  const { t } = useTranslation()
  const { address: connectedWalletAddress } = useWeb3Connection()

  const isLoggedInUser = connectedWalletAddress === address

  const userResponse = useUserById(address)
  const user = userResponse.data
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(user?.creatorUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  return (
    <InfoPreviewContainer>
      <Badge
        badgeContent={
          <Tooltip title={t('profile.verified')}>
            <Box>
              <VerifiedCreator sx={{ width: '26px', height: '26px' }} />
            </Box>
          </Tooltip>
        }
        invisible={!user?.isVerified}
        overlap="circular"
      >
        <Avatar src={creatorMetadata?.logo?.s3Url} sx={{ width: 170, height: 170 }} />
      </Badge>
      <Stack flex="5" justifyContent="space-between" overflow="auto">
        <Stack gap={1}>
          <Typography variant="dAppHeadline2">{creatorMetadata?.name}</Typography>
          <Address address={user?.id || ''} showCopyButton={false} showExternalLink={false} />
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
      {isLoggedInUser && (
        <IconButton sx={{ position: 'absolute', right: 24, top: 24 }}>
          <CreateOutlinedIcon />
        </IconButton>
      )}
    </InfoPreviewContainer>
  )
}
