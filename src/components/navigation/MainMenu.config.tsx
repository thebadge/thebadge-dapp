import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { Explore as ExploreIcon } from '@/src/components/assets/Explore'
import { Help } from '@/src/components/assets/Help'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { LightMode as LightModeIcon } from '@/src/components/assets/LightMode'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import { MenuItem } from '@/src/components/navigation/MainMenu.types'
import { DOCS_URL } from '@/src/constants/common'
import { useColorMode } from '@/src/providers/themeProvider'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { ThemeType } from '@/src/theme/types'
import {
  generateBaseUrl,
  generateExplorer,
  generateProfileUrl,
} from '@/src/utils/navigation/generateUrl'

export const useMainMenuItems = () => {
  const { address } = useWeb3Connection()

  const { mode, toggleColorMode } = useColorMode()

  const topMenuItems: Array<MenuItem> = [
    {
      type: 'color',
      icon: <HomeIcon />,
      title: 'Home',
      href: generateBaseUrl(),
    },
    {
      type: 'color',
      icon: <ExploreIcon />,
      title: 'Explore',
      href: generateExplorer(),
    },
    {
      type: 'color',
      icon: <ProfileIcon />,
      title: 'Profile',
      href: generateProfileUrl(),
      validation: !!address,
    },
  ]

  const bottomMenuItems: Array<MenuItem> = [
    {
      type: 'gray',
      icon: <Help />,
      title: 'Help',
      href: DOCS_URL,
      openLinkInNewTab: true,
    },
    {
      type: 'small',
      icon: mode === ThemeType.dark ? <LightModeIcon /> : <DarkModeIcon />,
      title: 'Change theme',
      customOnClickBehavior: () => toggleColorMode(), // change theme
      disabled: true,
    },
  ]

  return {
    topMenuItems,
    bottomMenuItems,
  }
}
