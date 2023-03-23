import { DarkMode as DarkModeIcon } from '@/src/components/assets/DarkMode'
import { Discord as DiscordIcon } from '@/src/components/assets/Discord'
import { Earn as EarnIcon } from '@/src/components/assets/Earn'
import { Home as HomeIcon } from '@/src/components/assets/Home'
import { LightMode as LightModeIcon } from '@/src/components/assets/LightMode'
import { Profile as ProfileIcon } from '@/src/components/assets/Profile'
import { Explore as ExploreIcon } from '@/src/components/assets/Explore'
import { MenuItem } from '@/src/components/navigation/MainMenu.types'
import { DISCORD_URL } from '@/src/constants/common'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ThemeType } from '@/src/theme/types'

export const useMainMenuItems = () => {
  const { address } = useWeb3Connection()
  const {
    becomeACreatorSection,
    becomeAThirdPartySection,
    claimBadgesSection,
    earnByCuratingSection,
    homeSection,
  } = useSectionReferences()
  const { mode, toggleColorMode } = useColorMode()

  const topMenuItems: Array<MenuItem> = [
    {
      type: 'color',
      icon: <HomeIcon />,
      title: 'Home',
      href: homeSection?.current ? homeSection : '/',
      subItems: [
        {
          title: 'Get a certificate',
          href: claimBadgesSection?.current ? claimBadgesSection : '/badge/mint',
        },
        {
          title: 'Earn by curating',
          href: earnByCuratingSection?.current ? earnByCuratingSection : '/curator/register',
        },
        {
          title: 'Badge creator',
          href: becomeACreatorSection?.current ? becomeACreatorSection : '/creator/register',
        },
        {
          title: 'Third-party entity',
          href: becomeAThirdPartySection?.current
            ? becomeAThirdPartySection
            : '/third-party/register',
        },
        // {
        //   title: 'Protocol statistics',
        //   href: '#statistics',
        // },
        // {
        //   title: 'The Badge DAO',
        //   href: '#',
        // },
        // {
        //   title: '$BADGE token',
        //   href: '#',
        // },
        // {
        //   title: 'FAQ',
        //   href: '#',
        // },
      ],
    },
    {
      type: 'color',
      icon: <ExploreIcon />,
      title: 'Explore',
      href: '/badge/explorer',
    },
    {
      type: 'color',
      icon: <EarnIcon />,
      title: 'Earn money',
      href: '#earn',
      subItems: [
        {
          title: 'Become a curator',
          href: '/curator/register',
        },
        {
          title: 'Become a creator',
          href: '/creator/register',
        },
        {
          title: 'Become a third-party entity',
          href: '/third-party/register',
        },
      ],
    },
    {
      type: 'color',
      icon: <ProfileIcon />,
      title: 'Profile',
      href: '/profile',
      validation: !!address,
      // subItems: [
      //   {
      //     title: 'My profile',
      //     subItems: [
      //       {
      //         title: 'Owned badges',
      //         href: '#',
      //       },
      //       {
      //         title: 'Near to expire',
      //         href: '#',
      //       },
      //       {
      //         title: 'Promoted',
      //         href: '#',
      //       },
      //       {
      //         title: 'Close to obtain',
      //         href: '#',
      //       },
      //       {
      //         title: 'You may be interested in',
      //         href: '#',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Create badge type',
      //     href: '/badge/type/create',
      //   },
      //   {
      //     title: 'Mint badge',
      //     href: '/badge/mint',
      //   },
      //   {
      //     title: 'Badges in review',
      //     href: '#',
      //   },
      //   {
      //     title: 'Created badges',
      //     href: '',
      //   },
      // ],
    },
  ]

  const bottomMenuItems: Array<MenuItem> = [
    {
      type: 'gray',
      icon: <DiscordIcon />,
      title: 'Community',
      href: DISCORD_URL,
      openLinkInNewTab: true,
    },
    {
      type: 'small',
      icon: mode === ThemeType.dark ? <LightModeIcon /> : <DarkModeIcon />,
      title: 'Change theme',
      customOnClickBehavior: () => toggleColorMode(), // change theme
    },
  ]

  return {
    topMenuItems,
    bottomMenuItems,
  }
}
