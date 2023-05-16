import React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getNetworkConfig } from '@/src/config/web3'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeType'
import { useBadgeCost } from '@/src/pagePartials/badge/curate/useBadgeCost'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function ChallengeCost({
  badgeTypeId,
  ownerAddress,
}: {
  badgeTypeId: string
  ownerAddress: string
}) {
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  const badgeTypeData = useBadgeModel(badgeTypeId)

  if (
    badgeTypeData.error ||
    !badgeTypeData.data?.badgeModel ||
    !badgeTypeData.data?.badgeModelMetadata
  ) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const challengeCost = useBadgeCost(badgeTypeId, ownerAddress)
  const challengePeriodDuration =
    badgeTypeData.data?.badgeModel.badgeModelKleros?.challengePeriodDuration / 60 / 60 / 24

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
        <Typography variant="dAppBody1">Total deposit required</Typography>
        <SafeSuspense>
          <Typography>
            {formatUnits(challengeCost?.toString(), 18)} {networkConfig.token}
          </Typography>
        </SafeSuspense>
      </Stack>
      <Box display="flex" flex={1} gap={2}>
        <ReportProblemOutlinedIcon sx={{ m: 'auto' }} />
        <Typography
          component="p"
          sx={{ display: 'flex', alignItems: 'center' }}
          variant="dAppBody1"
        >
          {`Note that this is a deposit, not a fee and it will be reimbursed if the removal is accepted. The challenge period last ${challengePeriodDuration} days.`}
        </Typography>
      </Box>
    </Box>
  )
}
