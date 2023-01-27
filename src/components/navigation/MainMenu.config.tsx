import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { Discord as DiscordIcon } from '@/src/components/assets/Discord'
import { Earn as EarnIcon } from '@/src/components/assets/Earn'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { LightMode as LightModeIcon } from '@/src/components/assets/LightMode'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import { MenuItem } from '@/src/components/navigation/MainMenu.types'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ThemeType } from '@/src/theme/types'

export const useMainMenuItems = () => {
  const { address } = useWeb3Connection()
  const { homeSection } = useSectionReferences()
  const { mode, toggleColorMode } = useColorMode()

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
          subItems: [
            {
              title: 'Owned badges',
              href: '#',
            },
            {
              title: 'Near to expire',
              href: '#',
            },
            {
              title: 'Promoted',
              href: '#',
            },
            {
              title: 'Close to obtain',
              href: '#',
            },
            {
              title: 'Discover',
              href: '#',
            },
          ],
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

  return {
    topMenuItems,
    bottomMenuItems,
  }
}
