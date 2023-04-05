import { useRouter } from 'next/router'
import React, { RefObject, useState } from 'react'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { Logout } from '@/src/components/assets/Logout'
import { SwitchNetwork } from '@/src/components/assets/SwitchNetwork'
import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { NavLink } from '@/src/components/navigation/NavLink'
import { useCurrentUser } from '@/src/hooks/useCurrentUser'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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

const StyledButton = styled(Button)<{ border?: string }>(({ border }) => ({
  color: 'white',
  border,
  borderRadius: '10px',
  fontSize: '14px !important',
  padding: '0.5rem 1rem !important',
  height: 'fit-content !important',
  lineHeight: '14px',
  fontWeight: 700,
  boxShadow: 'none',
}))

const Link = styled(NavLink)`
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export const UserDropdown: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { address, blockiesIcon, disconnectWallet, isWalletNetworkSupported } = useWeb3Connection()
  const user = useCurrentUser()
  const { becomeACreatorSection, scrollTo } = useSectionReferences()

  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuButton = (
    title: string,
    color: string,
    disabled: boolean,
    path: string,
    ref?: RefObject<HTMLDivElement> | null,
  ) => {
    return (
      <StyledButton
        border={`2px solid ${color}`}
        disabled={disabled}
        onClick={() => {
          scrollTo(path, ref || null)
        }}
      >
        {title}
      </StyledButton>
    )
  }
  const exploreButton = menuButton(
    t('header.buttons.explore'),
    colors.blue,
    false,
    '/badge/explorer',
  )
  const curateButton = menuButton(
    t('header.buttons.curate'),
    colors.greenLogo,
    false,
    '/badge/curate',
  )
  const createButton = menuButton(
    t('header.buttons.create'),
    colors.pink,
    !user || !user?.isCreator,
    '/badge/type/create',
  )

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        flex={1}
        justifyContent="space-between"
        sx={{ columnGap: '10px' }}
      >
        {exploreButton}
        {curateButton}

        {!user || !user?.isCreator ? (
          <Tooltip
            arrow
            title={
              <>
                {t('header.tooltips.becomeACreator.prefixText')}
                <Box
                  onClick={() => scrollTo('/', becomeACreatorSection)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {t('header.tooltips.becomeACreator.link')}
                </Box>
              </>
            }
          >
            <span>{createButton}</span>
          </Tooltip>
        ) : (
          createButton
        )}
      </Box>
      <Tooltip arrow title="Account settings">
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
        PaperProps={{
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
        }}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="account-menu"
        onClick={handleClose}
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem>
          Connected {address ? <>{truncateStringInTheMiddle(address, 8, 4)}</> : 'Error'}
        </MenuItem>
        <MenuItem onClick={() => router.push('/profile')}>
          <Avatar>{blockiesIcon} </Avatar> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setShowNetworkModal(true)}>
          <ListItemIcon>
            <SwitchNetwork />
          </ListItemIcon>
          Switch network
        </MenuItem>
        <MenuItem onClick={disconnectWallet}>
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
