import React, { useRef, useState } from 'react'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Box,
  IconButton,
  Menu,
  MenuProps,
  Skeleton,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import { ButtonV2, IconDiscord, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserAvatar from '@/src/components/common/TBUserAvatar'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { WCAddress } from '@/types/utils'

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
  ownerAddress: WCAddress
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
  const ownerMetadata = useUserMetadata(owner.data?.id, owner.data?.metadataUri || '')

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
          <SafeSuspense fallback={<Skeleton variant="circular" width={100} />}>
            <TBUserAvatar
              address={ownerAddress}
              src={ownerMetadata?.logo?.s3Url}
              sx={{ border: '1px solid white' }}
            />
          </SafeSuspense>

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
