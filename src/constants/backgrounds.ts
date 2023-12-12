import axios from 'axios'

import { BACKEND_URL } from '@/src/constants/common'
import { BadgeRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { BackendResponse } from '@/types/utils'

export type ModelsBackgroundsNames =
  | 'Rainbow Vortex'
  | 'White Waves'
  | 'Calm'
  | 'Neon Storm'
  | 'Mountain Sea'
  | 'Purple Lava'

export type ModelsBackgrounds = {
  [key in ModelsBackgroundsNames]: {
    url: string
    badgesRequired: BadgeRequired[]
    disabled?: boolean
  }
}

export const DEFAULT_BADGE_MODEL_BACKGROUNDS: ModelsBackgrounds = {
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
}

export const getBadgeModelBackgrounds = async (): Promise<ModelsBackgrounds> => {
  try {
    const res = await axios.get<BackendResponse<ModelsBackgrounds>>(
      `${BACKEND_URL}/api/appConfigs/backgroundConfigs`,
    )
    if (res.data && res.data.result) {
      return res.data.result
    }
  } catch (error) {
    console.warn('Error getting backgrounds...', error)
  }
  return DEFAULT_BADGE_MODEL_BACKGROUNDS
}

export const BADGE_MODEL_TEXT_CONTRAST: { [key: string]: string } = {
  White: 'dark-withTextBackground',
  Black: 'light-withTextBackground',
}

export const getBackgroundBadgeUrl = (
  backgroundName: ModelsBackgroundsNames | undefined,
  badgeModelBackgrounds: ModelsBackgrounds = DEFAULT_BADGE_MODEL_BACKGROUNDS,
): string => {
  try {
    if (backgroundName) {
      return badgeModelBackgrounds[backgroundName].url || badgeModelBackgrounds['White Waves'].url
    }
  } catch (error) {
    console.warn(`${backgroundName} not found in backgrounds list..`)
  }
  return badgeModelBackgrounds['White Waves'].url
}
