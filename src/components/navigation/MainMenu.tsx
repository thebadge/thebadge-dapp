import { useRouter } from 'next/router'
import { useState } from 'react'

import { styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { Discord as DiscordIcon } from '@/src/components/assets/Discord'
import { Earn as EarnIcon } from '@/src/components/assets/Earn'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import { MenuItem, MenuItemElement, MenuItemType } from '@/src/components/navigation/Menu.types'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const MenuContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: '#F4F4F4',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
  borderRadius: '0px 20px 0px 0px',
  padding: '3rem 1rem',
  gap: '2.5rem',
  flexWrap: 'wrap',
}))

const MainMenuContainer = styled(MenuContainer)(({ theme }) => ({
  height: 'fit-content',
  position: 'sticky',
  top: '8rem',
  marginRight: '5%',

  [theme.breakpoints.up('xl')]: {
    marginRight: 'calc(10% - 16px)',
  },
}))

const SubMenuContainer = styled(MenuContainer)<MenuItemElement>(({ theme, type }) => ({
  position: 'relative',

  ...(type === 'small'
    ? {
        left: '3.25rem',
      }
    : {
        left: '4rem',
      }),

  bottom: '3rem',
  padding: '2rem',
  width: '13rem',
  gap: '2rem',
}))

const MenuItemContainer = styled('div')<MenuItemElement>(({ theme, type }) => ({
  height: '3rem',
  position: 'relative',

  ...(type === 'small'
    ? {
        left: '0.75rem',
        top: '0.75rem',
      }
    : {
        left: '0rem',
        top: '0rem',
      }),
}))

const MenuItemsTopContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '2.5rem',
  marginBottom: '5rem',
  width: '3rem',
}))

const MenuItemsBottomContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '3rem',
}))

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

const MenuItem = styled('div')<MenuItemElement>(({ disabled, selected, theme, type }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',

  ...(type === 'small'
    ? {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #1C1B1F',
      }
    : {
        width: '3rem',
        height: '3rem',
        borderRadius: '1.5rem',
        border: 'none',
      }),

  background: `${getBackgroundColor(type)}`,

  '&:hover': {
    background: `${getHoverBackgroundColor(type)}`,
  },

  ...(selected
    ? {
        border: '1px solid #1C1B1F',
      }
    : null),

  ...(disabled
    ? {
        opacity: 0.5,
        cursor: 'default',
      }
    : null),
}))

const SubMenuTitleItem = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 900,
  fontSize: '12px',
  lineHeight: '15px',
  textTransform: 'uppercase',
  color: '#000000',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #000000',

  '&:hover': {
    opacity: 0.7,
    borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
  },
}))

const SubMenuItem = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '11px',
  lineHeight: '14px',
  textTransform: 'uppercase',
  color: '#4f4f4f',
  paddingBottom: '0.5rem',

  '&:hover': {
    color: '#000000',
  },
}))

export const MainMenu: React.FC = ({ ...restProps }) => {
  // const t = useTranslations('mainMenu')
  const { address } = useWeb3Connection()
  const router = useRouter()

  const [selectedElement, setSelectedElement] = useState(-1)

  const onMenuItemClick = (index: number, item: MenuItem) => {
    setSelectedElement(index)
  }

  const topMenuItems: Array<MenuItem> = [
    {
      type: 'color',
      icon: <HomeIcon />,
      title: 'Home',
      ref: '#home',
      subItems: [
        {
          title: 'Get a certificate',
          ref: '#',
        },
        {
          title: 'Protocol statistics',
          ref: '#',
        },
        {
          title: 'The Badge DAO',
          ref: '#',
        },
        {
          title: '$BADGE token',
          ref: '#',
        },
        {
          title: 'FAQ',
          ref: '#',
        },
      ],
    },
    {
      type: 'color',
      icon: <EarnIcon />,
      title: 'Earn money',
      ref: '#earn',
      subItems: [
        {
          title: 'Become a curator',
          ref: '#',
        },
        {
          title: 'Become a creator',
          ref: '#',
        },
        {
          title: 'Become a third-party entity',
          ref: '#',
        },
      ],
    },
    {
      type: 'color',
      icon: <ProfileIcon />,
      title: 'Profile',
      ref: '#profile',
      validation: !!address,
      subItems: [
        {
          title: 'My profile',
          ref: '#',
        },
        {
          title: 'Badges in review',
          ref: '#',
        },
        {
          title: 'Created badges',
          ref: '#',
        },
      ],
    },
  ]

  const bottomMenuItems: Array<MenuItem> = [
    {
      type: 'gray',
      icon: <DiscordIcon />,
      ref: '#discord',
    },
    {
      type: 'small',
      icon: <DarkModeIcon />,
      ref: '#mode',
    },
  ]

  const renderMenuItem = (item: MenuItem, index: number): React.ReactNode => {
    return (
      (item.validation === undefined || item.validation) && (
        <MenuItemContainer type={item.type}>
          <MenuItem
            disabled={!!item.disabled}
            onClick={() => onMenuItemClick(index, item)}
            selected={selectedElement === index}
            type={item.type}
          >
            {item.icon}
          </MenuItem>
          {item.subItems && selectedElement === index ? (
            <SubMenuContainer type={item.type}>
              <SubMenuTitleItem>{item.title}</SubMenuTitleItem>
              {item.subItems.map((subItem) => (
                // eslint-disable-next-line react/jsx-key
                <SubMenuItem>{subItem.title}</SubMenuItem>
              ))}
            </SubMenuContainer>
          ) : null}
        </MenuItemContainer>
      )
    )
  }

  return (
    <MainMenuContainer {...restProps}>
      <MenuItemsTopContainer>
        {topMenuItems.map((item, index) => renderMenuItem(item, index))}
      </MenuItemsTopContainer>
      <MenuItemsBottomContainer>
        {bottomMenuItems.map((item, index) => renderMenuItem(item, index + topMenuItems.length))}
      </MenuItemsBottomContainer>
    </MainMenuContainer>
  )
}
