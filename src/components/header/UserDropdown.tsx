import { useRouter } from 'next/router'
import React, { RefObject, useRef, useState } from 'react'

import { AddressZero } from '@ethersproject/constants'
import RadarIcon from '@mui/icons-material/Radar'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  alpha,
  styled,
} from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Blockies from 'react-18-blockies'

import { Logout } from '@/src/components/assets/Logout'
import ActionButtons from '@/src/components/header/ActionButtons'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getNetworkConfig } from '@/src/config/web3'
import { useSizeSM } from '@/src/hooks/useSize'
import { PreventActionIfOutOfService } from '@/src/pagePartials/errors/preventActionIfOutOfService'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { generateBaseUrl, generateProfileUrl } from '@/src/utils/navigation/generateUrl'

const StyledBadge = styled(Badge)<{ state?: 'ok' | 'error' }>(({ state, theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: `${state === 'ok' ? theme.palette.success.main : theme.palette.error.main}`,
    color: `${state === 'ok' ? theme.palette.success.main : theme.palette.error.main}`,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

export const UserDropdown: React.FC = () => {
  const router = useRouter()
  const { address, appChainId, disconnectWallet, isWalletNetworkSupported } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)
  const { open: openWeb3Modal } = useWeb3Modal()
  const isMobile = useSizeSM()

  const [open, setOpen] = useState(false)
  const anchorMenuElRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const toggleNetworkChange = () => {
    openWeb3Modal({ view: 'Networks' })
  }

  const handleProfileNavigation = () => {
    setOpen(false)

    router.push(generateProfileUrl())
  }

  const logout = async () => {
    await disconnectWallet()
    router.push(generateBaseUrl())
  }

  const blockiesIcon = (
    <SafeSuspense>
      <Blockies scale={3.2} seed={address || 'default'} size={10} />
    </SafeSuspense>
  )

  return (
    <>
      {!isMobile && (
        <PreventActionIfOutOfService>
          <ActionButtons />
        </PreventActionIfOutOfService>
      )}
      <Box
        borderRadius={20}
        height="fit-content"
        ml={2}
        sx={{
          backgroundColor: isWalletNetworkSupported ? 'transparent' : alpha(colors.redError, 0.2),
        }}
      >
        <w3m-network-button />
      </Box>

      <Tooltip arrow ref={anchorMenuElRef} title="Account settings">
        <IconButton
          aria-controls={open ? 'account-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
          sx={{ ml: 1 }}
        >
          <StyledBadge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            overlap="circular"
            state={isWalletNetworkSupported ? 'ok' : 'error'}
            variant="dot"
          >
            <Avatar sx={{ width: 32, height: 32 }}>{blockiesIcon}</Avatar>
          </StyledBadge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorMenuElRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="account-menu"
        onClose={handleClose}
        open={open}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        variant="menu"
      >
        <ListSubheader sx={{ lineHeight: '20px', pb: '6px' }}>{networkConfig.name}</ListSubheader>
        <SafeSuspense fallback={<Skeleton sx={{ ml: 2 }} variant="text" width={150} />}>
          <ListSubheader sx={{ lineHeight: '20px' }}>
            Connected <Address address={address || AddressZero} showExternalLink={false} />
          </ListSubheader>
        </SafeSuspense>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleProfileNavigation}>
          <Avatar>{blockiesIcon}</Avatar>
          <ListItemText primary="Profile" />
        </MenuItem>
        <Divider />

        {/* Switch network */}
        <MenuItem onClick={toggleNetworkChange} sx={{ pl: 1 }}>
          <ListItemIcon sx={{ mr: 1 }}>
            <RadarIcon />
          </ListItemIcon>
          <ListItemText primary="Switch network" />
        </MenuItem>

        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  )
}
