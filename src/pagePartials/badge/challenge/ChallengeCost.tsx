import React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getNetworkConfig } from '@/src/config/web3'
import { useBadgeCost } from '@/src/pagePartials/badge/curate/useBadgeCost'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function ChallengeCost({
  badgeTypeId,
  ownerAddress,
}: {
  badgeTypeId: string
  ownerAddress: string
}) {
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

  const challengeCost = useBadgeCost(badgeTypeId, ownerAddress)
  const challengePeriodDuration =
    badgeType.data?.badgeType?.klerosBadge?.challengePeriodDuration / 60 / 60 / 24

  if (!challengeCost) {
    throw 'There was not possible to get challenge cost. Try again in some minutes.'
  }

  return (
    <Box display="flex" flex={1} gap={4}>
      <Stack
        flex={1}
        gap={2}
        sx={{ borderBottom: '1px solid white', justifyContent: 'flex-end', pb: 2 }}
      >
        <Typography variant="subtitle2">Total deposit required</Typography>
        <SafeSuspense>
          <Typography>
            {formatUnits(challengeCost?.toString(), 18)} {networkConfig.token}
          </Typography>
        </SafeSuspense>
      </Stack>
      <Box display="flex" flex={1} gap={2}>
        <ReportProblemOutlinedIcon sx={{ m: 'auto' }} />
        <Typography component="p" sx={{ display: 'flex', alignItems: 'center' }} variant="caption">
          {`Note that this is a deposit, not a fee and it will be reimbursed if the removal is
                accepted. The challenge period last ${challengePeriodDuration} days.`}
        </Typography>
      </Box>
    </Box>
  )
}
