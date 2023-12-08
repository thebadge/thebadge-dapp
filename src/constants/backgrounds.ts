import { BadgeRequired } from '@/src/hooks/theBadge/useBadgesRequired'

export type ModelsBackgroundsNames =
  | 'Rainbow Vortex'
  | 'White Waves'
  | 'Calm'
  | 'Neon Storm'
  | 'Mountain Sea'
  | 'Purple Lava'
  | 'Winners wave (Premium)'
  | 'Hackers in black (Premium)'
  | 'Blue Confetti (Premium)'
  | 'Celestial Orange (Premium)'
  | 'Galactic Blue (Premium)'
  | 'Void Black (Premium)'
  | 'Sea Purple (Premium)'

export type ModelsBackgrounds = {
  [key in ModelsBackgroundsNames]: {
    url: string
    badgesRequired: BadgeRequired[]
    disabled?: boolean
  }
}

export const BADGE_MODEL_BACKGROUNDS: ModelsBackgrounds = {
  'Rainbow Vortex': {
    url: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'White Waves': {
    url: 'https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  Calm: {
    url: 'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjA5fHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'Neon Storm': {
    url: 'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'Mountain Sea': {
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'Purple Lava': {
    url: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'Winners wave (Premium)': {
    url: 'https://images.unsplash.com/photo-1556691421-cf15fe27a0b6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Hackers in black (Premium)': {
    url: 'https://images.unsplash.com/photo-1464639351491-a172c2aa2911?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Blue Confetti (Premium)': {
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Celestial Orange (Premium)': {
    url: 'https://images.unsplash.com/photo-1576502200272-341a4b8d5ebb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Galactic Blue (Premium)': {
    url: 'https://images.unsplash.com/photo-1627704362507-59aeb78090c5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Void Black (Premium)': {
    url: 'https://images.unsplash.com/photo-1637946175559-22c4fe13fc54?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
  'Sea Purple (Premium)': {
    url: 'https://images.unsplash.com/photo-1658483451190-d3b9bdc2ee43?q=80&w=2568&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      // {
      //   badgeId: 0,
      //   networkId: Chains.sepolia,
      //   contractAddress: contracts.TheBadge.address[Chains.sepolia],
      // },
    ],
  },
}

export const BADGE_MODEL_TEXT_CONTRAST: { [key: string]: string } = {
  White: 'dark-withTextBackground',
  Black: 'light-withTextBackground',
}

export const getBackgroundBadgeUrl = (
  backgroundName: ModelsBackgroundsNames | undefined,
): string => {
  if (backgroundName) {
    return BADGE_MODEL_BACKGROUNDS[backgroundName].url || BADGE_MODEL_BACKGROUNDS['White Waves'].url
  }
  return BADGE_MODEL_BACKGROUNDS['White Waves'].url
}
