import * as React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Divider, Stack, Tooltip, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { getNetworkConfig } from '@/src/config/web3'
import { DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { secondsToDays, secondsToMinutes } from '@/src/utils/dateUtils'
import { isTestnet } from '@/src/utils/network'

type Props = {
  costs: {
    mintCost: string
    klerosCost: string
    totalMintCost: string
  }
}

const CostContainer = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
  borderBottom: '1px solid white',
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

const ValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}))

export default function MintCost({ costs }: Props) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)
  const { badgeModelId } = useModelIdParam()

  if (!badgeModelId) {
    throw `No modelId provided as URL query param`
  }
  const badgeModelKlerosData = useRegistrationBadgeModelKlerosMetadata(badgeModelId)

  if (badgeModelKlerosData.error || !badgeModelKlerosData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const badgeModelMetadata = badgeModelKlerosData.data?.badgeModelKlerosRegistrationMetadata
  const badgeCriteria = badgeModelKlerosData.data?.badgeRegistrationCriteria

  if (!badgeModelMetadata) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const challengePeriodDuration = isTestnet
    ? secondsToMinutes(badgeModelKlerosData.data?.challengePeriodDuration)
    : secondsToDays(badgeModelKlerosData.data?.challengePeriodDuration)

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
      <Box display="flex" flex={1} gap={4}>
        <CostContainer>
          <Typography variant="dAppTitle2">{t('badge.model.mint.depositCost')}</Typography>
          <ValueContainer>
            <Typography variant="body2">
              {costs.klerosCost} {networkConfig.token}
            </Typography>
            <Tooltip
              arrow
              title={
                <MarkdownTypography
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontWeight: 300,
                    '& a': { textDecoration: 'underline !important' },
                  }}
                  variant="subtitle2"
                >
                  {t('badge.model.mint.depositDisclaimer', {
                    docsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
                    challengePeriodDuration,
                    timeUnit: isTestnet ? 'minutes' : 'days',
                  })}
                </MarkdownTypography>
              }
            >
              <ReportProblemOutlinedIcon />
            </Tooltip>
          </ValueContainer>
        </CostContainer>
        <CostContainer>
          <Typography variant="dAppTitle2">{t('badge.model.mint.mintCost')}</Typography>
          <ValueContainer>
            <Typography sx={{ display: 'flex' }} variant="body2">
              {costs.mintCost} {networkConfig.token}
            </Typography>
          </ValueContainer>
        </CostContainer>
      </Box>

      <Divider />

      <CostContainer>
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
        <a
          href={badgeCriteria as string}
          rel="noreferrer"
          style={{ color: colors.green }}
          target={'_blank'}
        >
          {t('badge.model.mint.curationCriteria')}
        </a>
        {t('badge.model.mint.avoidChallenges')}
      </Typography>
    </Stack>
  )
}
