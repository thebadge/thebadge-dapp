import React, { useMemo } from 'react'

import { Avatar, Badge, Box, Theme, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import { useTranslation } from 'next-export-i18n'
import Blockies from 'react-18-blockies'

import VerifiedCreator from '@/src/components/icons/VerifiedCreator'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import { WCAddress } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

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
  size = 90,
  src,
  sx,
}: {
  src?: string
  address?: WCAddress
  size?: number
  sx?: SxProps<Theme>
}) {
  const { t } = useTranslation()
  const { address: connectedAddress } = useWeb3Connection()
  // TODO Add logic to check verified into another controllers, maybe using pathname where the avatar is rendered
  const isVerified = useIsUserVerified(address || connectedAddress, 'kleros')

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
