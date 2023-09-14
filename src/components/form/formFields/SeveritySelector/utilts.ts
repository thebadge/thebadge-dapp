import { BigNumber } from '@ethersproject/bignumber'

import { ZERO_BN } from '@/src/constants/bigNumber'
import {
  SEVERITY_ABOVE_BOUNTY_MULTIPLIER,
  SEVERITY_ABOVE_JURORS,
  SEVERITY_HEAVY_BOUNTY_MULTIPLIER,
  SEVERITY_HEAVY_JURORS,
  SEVERITY_NORMAL_BOUNTY_MULTIPLIER,
  SEVERITY_NORMAL_JURORS,
} from '@/src/constants/common'
import { Severity } from '@/types/utils'

export const SEVERITY_COLORS = {
  [Severity.Normal]: '#24F3D2',
  [Severity['Above average']]: '#59BCF7',
  [Severity.Heavy]: '#284EE8',
  [Severity.Custom]: '#AF20AF',
}

export const SEVERITY_FEES = {
  [Severity.Normal]: {
    amountOfJurors: SEVERITY_NORMAL_JURORS,
    challengeBountyMultiplier: SEVERITY_NORMAL_BOUNTY_MULTIPLIER,
  },
  [Severity['Above average']]: {
    amountOfJurors: SEVERITY_ABOVE_JURORS,
    challengeBountyMultiplier: SEVERITY_ABOVE_BOUNTY_MULTIPLIER,
  },
  [Severity.Heavy]: {
    amountOfJurors: SEVERITY_HEAVY_JURORS,
    challengeBountyMultiplier: SEVERITY_HEAVY_BOUNTY_MULTIPLIER,
  },
  [Severity.Custom]: {
    amountOfJurors: SEVERITY_HEAVY_JURORS,
    challengeBountyMultiplier: 0,
  },
}

export function getDefaultConfigs(severity: number, feePerJuror?: BigNumber) {
  switch (severity) {
    case Severity.Normal:
      return {
        amountOfJurors: 1,
        challengeBounty: (
          feePerJuror?.mul(SEVERITY_FEES[severity].challengeBountyMultiplier || 0) || ZERO_BN
        ).toString(),
      }
    case Severity['Above average']:
      return {
        amountOfJurors: 3,
        challengeBounty: (
          feePerJuror?.mul(SEVERITY_FEES[severity].challengeBountyMultiplier || 0) || ZERO_BN
        ).toString(),
      }
    case Severity.Heavy:
      return {
        amountOfJurors: 3,
        challengeBounty: (
          feePerJuror?.mul(SEVERITY_FEES[severity].challengeBountyMultiplier || 0) || ZERO_BN
        ).toString(),
      }
    case Severity.Custom:
      return {
        amountOfJurors: 3,
        challengeBounty: (
          feePerJuror?.mul(SEVERITY_FEES[severity].challengeBountyMultiplier || 0) || ZERO_BN
        ).toString(),
      }
    default:
      return {
        amountOfJurors: 1,
        challengeBounty: (
          feePerJuror?.mul(SEVERITY_FEES[Severity.Normal].challengeBountyMultiplier || 0) || ZERO_BN
        ).toString(),
      }
  }
}
