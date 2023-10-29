import React, { useMemo } from 'react'

import { Avatar, Badge, Box, Theme, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import useTranslation from 'next-translate/useTranslation'
import Blockies from 'react-18-blockies'

import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

/**
 * Avatar implementation that fallbacks on Blocajes generated with the address, if the given src is not valid
 * @param address
 * @param isVerified
 * @param size
 * @param src
 * @param sx
 * @constructor
 */
export default function TBUserAvatar({
  address,
  isVerified,
  size = 90,
  src,
  sx,
}: {
  src?: string
  address?: string
  size?: number
  isVerified?: boolean
  sx?: SxProps<Theme>
}) {
  const { t } = useTranslation()
  const { address: connectedAddress } = useWeb3Connection()

  const seed = useMemo(() => {
    return address || connectedAddress || 'default'
  }, [address, connectedAddress])

  return (
    <Badge
      badgeContent={
        <Tooltip title={t('profile.verified')}>
          <Box>
            <VerifiedCreator sx={{ width: '26px', height: '26px' }} />
          </Box>
        </Tooltip>
      }
      invisible={!isVerified}
      overlap="circular"
    >
      <Avatar src={src} sx={{ width: size, height: size, ...sx }}>
        <Blockies className="blockies-avatar" scale={size / 10} seed={seed} size={size / 10} />
      </Avatar>
    </Badge>
  )
}
