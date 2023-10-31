import React from 'react'

import { Box, Typography } from '@mui/material'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { getNetworkConfig } from '@/src/config/web3'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

// TODO Improve design when we have it on figma
export default function BadgeMintCost({ modelId }: { modelId: string }) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  const { data: mintValue } = useMintValue(modelId)
  const badgeModelData = useBadgeModel(modelId)

  const creatorFee = BigNumber.from(badgeModelData.data?.badgeModel.creatorFee || 0)

  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${modelId}`
  }

  const depositValue = mintValue.sub(creatorFee)

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography variant="labelLarge">
        {t('explorer.preview.badge.depositCost')}
        <Typography component="span" sx={{ ml: 1 }} variant="labelLarge">
          {formatUnits(depositValue, 18)} {networkConfig.token}
        </Typography>
      </Typography>
      <Typography variant="labelLarge">
        {t('explorer.preview.badge.mintCost')}
        <Typography component="span" sx={{ ml: 1 }} variant="labelLarge">
          {formatUnits(creatorFee, 18)} {networkConfig.token}
        </Typography>
      </Typography>
    </Box>
  )
}
