import { Button } from '@mui/material'
import dayjs from 'dayjs'
import { formatUnits } from 'ethers/lib/utils'
import Countdown from 'react-countdown'

import { getNetworkConfig } from '@/src/config/web3'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useBadgeCost } from '@/src/pagePartials/badge/curate/useBadgeCost'
import { useChallengeProvider } from '@/src/providers/challengeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BadgesInReviewQuery } from '@/types/generated/subgraph'

type Props = {
  badge: BadgesInReviewQuery['badges'][0]
}
export function BadgeCuration({ badge }: Props) {
  const { appChainId } = useWeb3Connection()
  const challengeCost = useBadgeCost(badge.badgeType.id, badge.receiver.id)
  const { challenge } = useChallengeProvider()

  if (!challengeCost) {
    throw 'There was not possible to get challenge cost.'
  }

  const networkConfig = getNetworkConfig(appChainId)

  return (
    <>
      <BadgeTypeMetadata metadata={badge.badgeType.metadataURL} />
      <div>
        Challenge cost: {formatUnits(challengeCost?.toString(), 18)} {networkConfig.token}
      </div>
      <div>
        Review ends in <Countdown date={dayjs.unix(badge.reviewDueDate).toDate()} />
      </div>
      <Button onClick={() => challenge(badge.badgeType.id, badge.receiver.id)}> Challenge </Button>
      <br />
    </>
  )
}
