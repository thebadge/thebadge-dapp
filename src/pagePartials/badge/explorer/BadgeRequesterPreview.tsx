import React, { useRef, useState } from 'react'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuProps,
  Stack,
  Tooltip,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import { ButtonV2, IconDiscord, colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'
import Blockies from 'react-18-blockies'

import { Address } from '@/src/components/helpers/Address'
import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import { APP_URL } from '@/src/constants/common'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { CreatorMetadata } from '@/types/badges/Creator'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  justifyContent: 'space-between',
  border: `1px solid ${colors.purple}`,
  filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.3))',
  borderRadius: theme.spacing(1, 1, 0, 0),
  padding: theme.spacing(0.1, 2, 0.1, 2),
}))

type OwnerDisplayProps = MenuProps & { width?: number; color?: string }

const OwnerDisplay = styled(Menu)<OwnerDisplayProps>(({ color, theme, width }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#000',
    backgroundImage: 'none',
    boxShadow: `0px 0px 4px ${alpha(color || colors.purple, 0.6)}`,
    padding: theme.spacing(1, 2, 1, 2),
    borderRadius: theme.spacing(0, 0, 1, 1),
    width: `${width}px`,
    maxWidth: `${width}px`,
  },
}))

export default function BadgeRequesterPreview({
  color,
  ownerAddress,
}: {
  ownerAddress: string
  color?: string
}) {
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>()
  const open = Boolean(anchorEl)

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }
  const handleClick = () => {
    if (wrapperRef?.current) setAnchorEl(wrapperRef.current)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content
  const isVerified = useIsUserVerified(ownerAddress, 'kleros')

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <Box alignItems="center" display="flex" gap={1}>
          <Typography variant="dAppTitle5">{t('explorer.curate.requester')}</Typography>
          <Address address={ownerAddress} showExternalLink={false} />
        </Box>

        <IconButton onClick={handleClick} size="small">
          {!open ? <AddRoundedIcon color="purple" /> : <RemoveRoundedIcon color="purple" />}
        </IconButton>
      </Wrapper>
      <OwnerDisplay
        anchorEl={anchorEl}
        color={color}
        onClose={handleClose}
        open={open}
        width={wrapperRef.current?.getBoundingClientRect().width}
      >
        <Box display="flex" flex="1" gap={2}>
          <Badge
            badgeContent={
              <Tooltip title={t('badge.viewBadge.owner.verified')}>
                <Box>
                  <VerifiedCreator sx={{ width: '26px', height: '26px' }} />
                </Box>
              </Tooltip>
            }
            invisible={!isVerified.data}
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
            <ButtonV2
              backgroundColor={colors.transparent}
              fontColor={colors.purple}
              onClick={() =>
                window.open(APP_URL + generateProfileUrl({ address: ownerAddress }), '_ blank')
              }
              sx={{
                borderRadius: 2,
                mt: 2,
              }}
              variant="outlined"
            >
              <Typography fontSize="12px !important">
                {t('badge.viewBadge.owner.profile')}
              </Typography>
            </ButtonV2>
          </Stack>
        </Box>
      </OwnerDisplay>
    </>
  )
}
