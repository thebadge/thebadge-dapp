import { Severity } from '@/types/utils'

export const SEVERITY_COLORS = {
  [Severity.Normal]: '#24F3D2',
  [Severity['Above average']]: '#59BCF7',
  [Severity.Heavy]: '#284EE8',
  [Severity.Custom]: '#AF20AF',
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
