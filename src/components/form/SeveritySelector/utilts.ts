import { Severity } from '@/types/utils'

export function getDefaultConfigs(severity: number) {
  console.log(severity)
  switch (severity) {
    case Severity.Normal:
      return {
        amountOfJurors: 1,
        challengeBounty: '0.01',
      }
    case Severity['Above average']:
      return {
        amountOfJurors: 3,
        challengeBounty: '0.01',
      }
    case Severity.Heavy:
      return {
        amountOfJurors: 3,
        challengeBounty: '0.02',
      }
    case Severity.Custom:
      return {
        amountOfJurors: 3,
        challengeBounty: '0.05',
      }
  }
}
