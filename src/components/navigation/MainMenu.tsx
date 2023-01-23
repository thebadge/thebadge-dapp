import { useRouter } from 'next/router'
import { useState } from 'react'

import { styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { Discord as DiscordIcon } from '@/src/components/assets/Discord'
import { Earn as EarnIcon } from '@/src/components/assets/Earn'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { LightMode as LightModeIcon } from '@/src/components/assets/LightMode'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import {
  MenuItem,
  MenuItemElement,
  MenuItemType,
  SubMenuItem,
} from '@/src/components/navigation/Menu.types'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ThemeType } from '@/src/theme/types'

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

const getMenuItemBackgroundColor = (type: MenuItemType): string => {
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

const getMenuItemHoverBackgroundColor = (type: MenuItemType): string => {
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

  background: `${getMenuItemBackgroundColor(type)}`,

  '&:hover': {
    background: `${getMenuItemHoverBackgroundColor(type)}`,
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
  const { homeSection, scrollTo } = useSectionReferences()
  const { mode, toggleColorMode } = useColorMode()

  const [selectedElement, setSelectedElement] = useState(-1)

  const navigateTo = async (link: any) => {
    if (link) {
      if (link.current) {
        scrollTo(link)
      } else {
        await router.push(link)
      }
    }
  }

  const onItemClick = async (item: MenuItem | SubMenuItem) => {
    if (item.href) {
      await navigateTo(item.href)
    }
    if (item.customOnClickBehavior) {
      item.customOnClickBehavior()
    }
  }

  const onMenuItemClick = async (item: MenuItem, index: number) => {
    setSelectedElement(index)
    await onItemClick(item)
  }

  const topMenuItems: Array<MenuItem> = [
    {
      type: 'color',
      icon: <HomeIcon />,
      title: 'Home',
      href: homeSection,
      subItems: [
        {
          title: 'Get a certificate',
          href: '#getCertificate',
        },
        {
          title: 'Protocol statistics',
          href: '#statistics',
        },
        {
          title: 'The Badge DAO',
          href: '#',
        },
        {
          title: '$BADGE token',
          href: '#',
        },
        {
          title: 'FAQ',
          href: '#',
        },
      ],
    },
    {
      type: 'color',
      icon: <EarnIcon />,
      title: 'Earn money',
      href: '#earn',
      subItems: [
        {
          title: 'Become a curator',
          href: '#',
        },
        {
          title: 'Become a creator',
          href: '#',
        },
        {
          title: 'Become a third-party entity',
          href: '#',
        },
      ],
    },
    {
      type: 'color',
      icon: <ProfileIcon />,
      title: 'Profile',
      href: '#profile',
      validation: !!address,
      subItems: [
        {
          title: 'My profile',
          href: '#',
        },
        {
          title: 'Badges in review',
          href: '#',
        },
        {
          title: 'Created badges',
          href: '#',
        },
      ],
    },
  ]

  const bottomMenuItems: Array<MenuItem> = [
    {
      type: 'gray',
      icon: <DiscordIcon />,
      href: '#discord',
    },
    {
      type: 'small',
      icon: mode === ThemeType.dark ? <LightModeIcon /> : <DarkModeIcon />,
      customOnClickBehavior: () => toggleColorMode(), // change theme
    },
  ]
  const renderMenuItem = (item: MenuItem, itemIndex: number): React.ReactNode => {
    return (
      (item.validation === undefined || item.validation) && (
        <MenuItemContainer type={item.type}>
          <MenuItem
            disabled={!!item.disabled}
            onClick={async () => await onMenuItemClick(item, itemIndex)}
            selected={selectedElement === itemIndex}
            type={item.type}
          >
            {item.icon}
          </MenuItem>
          {item.subItems && selectedElement === itemIndex ? (
            <SubMenuContainer type={item.type}>
              <SubMenuTitleItem onClick={async () => await onItemClick(item)}>
                {item.title}
              </SubMenuTitleItem>
              {item.subItems.map((subItem, subItemIndex) => (
                <SubMenuItem
                  key={'item-' + itemIndex + '-subItem-' + subItemIndex}
                  onClick={async () => await onItemClick(subItem)}
                >
                  {subItem.title}
                </SubMenuItem>
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
