import { colors } from '@thebadge/ui-library'

import { Severity } from '@/types/utils'

export const SEVERITY_COLORS = {
  [Severity.Normal]: colors.green,
  [Severity['Above average']]: colors.purple,
  [Severity.Heavy]: colors.pink,
  [Severity.Custom]: colors.deepPurple,
}

export const SEVERITY_FEES = {
  [Severity.Normal]: {
    amountOfJurors: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_NORMAL_JURORS || 0),
    challengeBountyMultiplier: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_NORMAL_BOUNTY || 0),
  },
  [Severity['Above average']]: {
    amountOfJurors: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_ABOVE_JURORS || 0),
    challengeBountyMultiplier: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_ABOVE_BOUNTY || 0),
  },
  [Severity.Heavy]: {
    amountOfJurors: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_HEAVY_JURORS || 0),
    challengeBountyMultiplier: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_HEAVY_BOUNTY || 0),
  },
  [Severity.Custom]: {
    amountOfJurors: +(process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_HEAVY_JURORS || 0),
    challengeBountyMultiplier: 0,
  },
}

export function getDefaultConfigs(severity: number) {
  switch (severity) {
    case Severity.Normal:
      return {
        amountOfJurors: 1,
        challengeBounty: 0,
      }
    case Severity['Above average']:
      return {
        amountOfJurors: 3,
        challengeBounty: 0,
      }
    case Severity.Heavy:
      return {
        amountOfJurors: 3,
        challengeBounty: 0,
      }
    case Severity.Custom:
      return {
        amountOfJurors: 3,
        challengeBounty: 0,
      }
    default:
      return {
        amountOfJurors: 1,
        challengeBounty: 0,
      }
  }
}
