import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { secondsToDays } from '@/src/utils/dateUtils'
import { TCR, TCR__factory } from '@/types/generated/typechain'

type Props = {
  tcrList: string
}
function GetBadgeTypeChallengePeriodDuration({ tcrList }: Props) {
  const tcr = useContractInstance(TCR__factory, 'TCR', tcrList)
  const calls = [tcr.challengePeriodDuration] as const
  const [resDuration] = useContractCall<TCR, typeof calls>(
    calls,
    [[]],
    `tcr-challengePeriodDuration-${tcrList}`,
  )

  const duration = resDuration.data?.[0].toNumber() || 0

  return <SafeSuspense>{secondsToDays(duration)}</SafeSuspense>
}
export default GetBadgeTypeChallengePeriodDuration
