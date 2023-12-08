import { Chains } from '@/src/config/web3'
import { contracts } from '@/src/contracts/contracts'
import { BadgeRequired } from '@/src/hooks/theBadge/useBadgesRequired'

export type ModelsBackgrounds = {
  [key: string]: {
    url: string
    badgesRequired: BadgeRequired[]
    disabled?: boolean
  }
}

export const BADGE_MODEL_BACKGROUNDS: ModelsBackgrounds = {
  'Rainbow Vortex': {
    url: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80',
    badgesRequired: [],
  },
  'White Waves': {
    url: 'https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    badgesRequired: [],
  },
  Calm: {
    url: 'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjA5fHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    badgesRequired: [],
  },
  'Neon Storm': {
    url: 'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    badgesRequired: [],
  },
  'Mountain Sea': {
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
    badgesRequired: [],
  },
  'Purple Lava': {
    url: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [],
  },
  'Purple Lava (Premium)': {
    url: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
    badgesRequired: [
      {
        badgeId: 0,
        networkId: Chains.sepolia,
        contractAddress: contracts.TheBadge.address[Chains.sepolia],
      },
    ],
  },
}

export const BADGE_MODEL_TEXT_CONTRAST: { [key: string]: string } = {
  White: 'dark-withTextBackground',
  Black: 'light-withTextBackground',
}

export const getBackgroundBadgeUrl = (backgroundName?: string | number): string => {
  if (backgroundName) {
    return BADGE_MODEL_BACKGROUNDS[backgroundName].url || BADGE_MODEL_BACKGROUNDS['White Waves'].url
  }
  return BADGE_MODEL_BACKGROUNDS['White Waves'].url
}
