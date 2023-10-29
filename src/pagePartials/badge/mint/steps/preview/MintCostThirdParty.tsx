import * as React from 'react'

import { Box, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { getNetworkConfig } from '@/src/config/web3'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  costs: {
    totalMintCost: string
  }
}

const CostContainer = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
  borderBottom: '1px solid white',
  margin: 'auto',
}))

const ValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}))

export default function MintCostThirdParty({ costs }: Props) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)
  const modelId = useModelIdParam()

  if (!modelId) {
    throw `No modelId provided as URL query param`
  }

  return (
    <Stack
      sx={{
        border: `1px solid ${colors.green}`,
        borderRadius: 2,
        p: 4,
        maxWidth: '700px',
        gap: 2,
      }}
    >
      <CostContainer width="50%">
        <Typography color={colors.green} variant="dAppTitle2">
          {t('badge.model.mint.totalCost')}
        </Typography>
        <ValueContainer>
          <Typography
            color={colors.green}
            sx={{ display: 'flex', fontWeight: 'bold' }}
            variant="body2"
          >
            {costs.totalMintCost} {networkConfig.token}
          </Typography>
        </ValueContainer>
      </CostContainer>

      <Typography mt={2} textAlign="center" variant="subtitle2">
        {t('badge.model.mint.makeSure')}
        {t('badge.model.mint.avoidChallenges')}
      </Typography>
    </Stack>
  )
}
