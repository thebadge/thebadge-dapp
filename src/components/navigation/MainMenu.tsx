import { useRouter } from 'next/router'

import { styled } from '@mui/material'
// import styled from 'styled-components'

// import { useTranslations } from 'next-intl'

import { colors } from 'thebadge-ui-library'

import { Discord as DiscordIcon } from '@/src/components/assets/Discord'
import { Earn as EarnIcon } from '@/src/components/assets/Earn'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const MainMenuContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '500px',
  marginRight: '5%',
  background: '#F4F4F4',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
  borderRadius: '0px 20px 0px 0px',
  padding: '3rem 1rem',
  gap: '2.5rem',
  flexWrap: 'wrap',

  [theme.breakpoints.up('xl')]: {
    marginRight: 'calc(10% - 16px)',
  },
}))

const MenuItemsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '2.5rem',
}))

type MenuItemType = 'color' | 'gray' | 'small'
type MenuItem = {
  type: MenuItemType
}

const getBackgroundColor = (type: MenuItemType): string => {
  switch (type) {
    case 'color':
      return colors.greenLogo
    case 'gray':
      return '#BDBDBD'
    case 'small':
    default:
      return 'transparent'
  }
}

const getHoverBackgroundColor = (type: MenuItemType): string => {
  switch (type) {
    case 'color':
      return '#22DBBD'
    case 'gray':
      return '#828282'
    case 'small':
    default:
      return 'transparent'
  }
}

const MenuItem = styled('div')<MenuItem>(({ theme, type }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // width: { type === 'small' ? '' : '3rem'},
  width: '3rem',
  height: '3rem',
  borderRadius: '1.5rem',
  cursor: 'pointer',
  background: `${getBackgroundColor(type)}`,

  '&:hover': {
    background: `${getHoverBackgroundColor(type)}`,
  },

  '&.active': {
    border: '1px solid #1C1B1F',
  },

  '&.disabled': {
    opacity: 0.5,
    cursor: 'default',
  },
}))

export const MainMenu: React.FC = ({ ...restProps }) => {
  // const t = useTranslations('mainMenu')
  const { address } = useWeb3Connection()
  const router = useRouter()
  return (
    <MainMenuContainer {...restProps}>
      <MenuItemsContainer>
        <MenuItem
          type={'color'}
          // className={router.route == '/home' ? 'active' : ''}
          // href="/"
        >
          <HomeIcon />
        </MenuItem>
        <MenuItem
          type={'color'}
          // className={router.route == '/home' ? 'active' : ''}
          // href="/"
        >
          <EarnIcon />
          {/*{t('home')}*/}
        </MenuItem>
        {address && (
          <MenuItem
            type={'color'}
            // className={router.route == '/profile/[address]' ? 'active' : ''}
            // href={`/profile/${address}`}
          >
            <ProfileIcon />
            {/*{t('profile')}*/}
          </MenuItem>
        )}
      </MenuItemsContainer>

      <MenuItem type={'gray'}>
        <DiscordIcon />
      </MenuItem>
      <MenuItem type={'small'}>
        <DarkModeIcon />
      </MenuItem>
    </MainMenuContainer>
  )
}
