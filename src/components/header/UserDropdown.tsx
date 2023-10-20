import { useRouter } from 'next/router'
import React, { RefObject, useRef, useState } from 'react'

import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from '@mui/material'
import Blockies from 'react-18-blockies'

import { Logout } from '@/src/components/assets/Logout'
import { SwitchNetwork } from '@/src/components/assets/SwitchNetwork'
import ActionButtons from '@/src/components/header/ActionButtons'
import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateBaseUrl, generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { truncateStringInTheMiddle } from '@/src/utils/strings'

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
  const { address, disconnectWallet, isWalletNetworkSupported } = useWeb3Connection()
  const [open, setOpen] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const anchorElRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
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
      <ActionButtons />
      <Tooltip arrow ref={anchorElRef} title="Account settings">
        <IconButton
          aria-controls={open ? 'account-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
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
        anchorEl={anchorElRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="account-menu"
        onClick={handleClose}
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
      >
        <MenuItem>
          Connected {address ? <>{truncateStringInTheMiddle(address, 8, 4)}</> : 'Error'}
        </MenuItem>
        <MenuItem onClick={() => router.push(generateProfileUrl())}>
          <Avatar>{blockiesIcon} </Avatar> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setShowNetworkModal(true)}>
          <ListItemIcon>
            <SwitchNetwork />
          </ListItemIcon>
          Switch network
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {showNetworkModal && (
        <ModalSwitchNetwork onClose={() => setShowNetworkModal(false)} open={showNetworkModal} />
      )}
    </>
  )
}
