import { useRouter } from 'next/router'
import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Paper, Stack, Typography, alpha, styled } from '@mui/material'
import { ButtonV2, IconDiscord, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserAvatar from '@/src/components/common/TBUserAvatar'
import { Address } from '@/src/components/helpers/Address'
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

type UserDisplayProps = { color?: string }

const UserDisplay = styled(Paper)<UserDisplayProps>(({ color, theme }) => ({
  backgroundColor: '#000',
  backgroundImage: 'none',
  boxShadow: `0px 0px 4px ${alpha(color || colors.purple, 0.6)}`,
  padding: theme.spacing(2.5, 2, 2.5, 2),
  borderRadius: theme.spacing(0, 0, 1, 1),
}))

export default function TBUserInfoSmallPreview({
  color,
  isVerified,
  label,
  metadata,
  userAddress,
}: {
  color: string
  userAddress: string
  metadata?: CreatorMetadata
  label?: string
  isVerified?: boolean
}) {
  const { t } = useTranslation()
  const router = useRouter()

  function handleClick() {
    window.open(`${router.basePath}/profile/${userAddress}`, '_ blank')
  }

  return (
    <Stack>
      <Wrapper>
        <Box alignItems="center" display="flex" gap={1}>
          {label && <Typography variant="dAppTitle5">{label}</Typography>}
          <Address address={userAddress} showExternalLink={false} />
        </Box>

        <ButtonV2 backgroundColor={colors.transparent} fontColor={color} onClick={handleClick}>
          <Typography fontSize="12px !important">{t('badge.viewBadge.owner.profile')}</Typography>
        </ButtonV2>
      </Wrapper>

      <UserDisplay color={color}>
        <Box display="flex" flex="1" gap={2}>
          <TBUserAvatar
            address={userAddress}
            isVerified={isVerified}
            src={metadata?.logo?.s3Url}
            sx={{ border: '1px solid white' }}
          />
          <Stack gap={1}>
            <Typography variant="dAppHeadline2">
              {metadata?.name || truncateStringInTheMiddle(userAddress, 8, 6)}
            </Typography>
            <Stack flex="1" justifyContent="space-evenly">
              {metadata?.email && (
                <Typography variant="dAppTitle2">
                  <EmailOutlinedIcon sx={{ mr: 1 }} />
                  {metadata?.email}
                </Typography>
              )}
              {metadata?.twitter && (
                <Typography variant="dAppTitle2">
                  <TwitterIcon sx={{ mr: 1 }} />
                  {metadata?.twitter}
                </Typography>
              )}
              {metadata?.discord && (
                <Typography variant="dAppTitle2">
                  <IconDiscord sx={{ mr: 1 }} />
                  {metadata?.discord}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </UserDisplay>
    </Stack>
  )
}
