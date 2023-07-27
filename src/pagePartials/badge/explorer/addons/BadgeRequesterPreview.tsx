import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Avatar, Badge, Box, Paper, Stack, Tooltip, Typography, alpha, styled } from '@mui/material'
import { ButtonV2, IconDiscord, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import Blockies from 'react-18-blockies'

import { Address } from '@/src/components/helpers/Address'
import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import { APP_URL } from '@/src/constants/common'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { CreatorMetadata } from '@/types/badges/Creator'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  justifyContent: 'space-between',
  border: `1px solid ${colors.purple}`,
  filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.3))',
  borderRadius: theme.spacing(1, 1, 0, 0),
  padding: theme.spacing(0.1, 0, 0.1, 2),
}))

type OwnerDisplayProps = { color?: string }

const OwnerDisplay = styled(Paper)<OwnerDisplayProps>(({ color, theme }) => ({
  backgroundColor: '#000',
  backgroundImage: 'none',
  boxShadow: `0px 0px 4px ${alpha(color || colors.purple, 0.6)}`,
  padding: theme.spacing(1, 2, 1, 2),
  borderRadius: theme.spacing(0, 0, 1, 1),
}))

export default function BadgeRequesterPreview({
  color,
  ownerAddress,
}: {
  ownerAddress: string
  color?: string
}) {
  const { t } = useTranslation()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.creatorUri || '')
  const ownerMetadata = resMetadata.data?.content

  function handleClick() {
    window.open(`${APP_URL}/profile/${ownerAddress}`, '_ blank')
  }

  return (
    <Stack>
      <Wrapper>
        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="dAppTitle5">{t('explorer.curate.requester')}</Typography>
          <Address address={ownerAddress} showExternalLink={false} />
        </Box>

        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.purple}
          onClick={handleClick}
        >
          <Typography fontSize="12px !important">{t('badge.viewBadge.owner.profile')}</Typography>
        </ButtonV2>
      </Wrapper>
      <OwnerDisplay color={color}>
        <Box display="flex" flex="1" gap={2}>
          <Badge
            badgeContent={
              <Tooltip title={t('badge.viewBadge.owner.verified')}>
                <Box>
                  <VerifiedCreator sx={{ width: '26px', height: '26px' }} />
                </Box>
              </Tooltip>
            }
            invisible={!owner.data?.isVerified}
            overlap="circular"
          >
            {ownerMetadata?.logo ? (
              <Avatar
                src={ownerMetadata?.logo?.s3Url}
                sx={{ width: 90, height: 90, border: '1px solid white' }}
              />
            ) : (
              <Avatar sx={{ width: 90, height: 90, border: '1px solid white' }}>
                <Blockies
                  className="blockies-avatar"
                  scale={10}
                  seed={ownerAddress || 'default'}
                  size={10}
                />
              </Avatar>
            )}
          </Badge>
          <Stack gap={1}>
            <Typography variant="dAppHeadline2">
              {ownerMetadata?.name || truncateStringInTheMiddle(ownerAddress, 8, 6)}
            </Typography>
            <Stack flex="1" justifyContent="space-evenly">
              {ownerMetadata?.email && (
                <Typography variant="dAppTitle2">
                  <EmailOutlinedIcon sx={{ mr: 1 }} />
                  {ownerMetadata?.email}
                </Typography>
              )}
              {ownerMetadata?.twitter && (
                <Typography variant="dAppTitle2">
                  <TwitterIcon sx={{ mr: 1 }} />
                  {ownerMetadata?.twitter}
                </Typography>
              )}
              {ownerMetadata?.discord && (
                <Typography variant="dAppTitle2">
                  <IconDiscord sx={{ mr: 1 }} />
                  {ownerMetadata?.discord}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </OwnerDisplay>
    </Stack>
  )
}
