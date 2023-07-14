import * as React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { getNetworkConfig } from '@/src/config/web3'
import { DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type Props = {
  costs: {
    mintCost: string
    klerosCost: string
    totalMintCost: string
  }
}
export default function MintCost({ costs }: Props) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)
  const modelId = useModelIdParam()

  if (!modelId) {
    throw `No modelId provided as URL query param`
  }
  const badgeModelKlerosData = useRegistrationBadgeModelKlerosMetadata(modelId)

  if (badgeModelKlerosData.error || !badgeModelKlerosData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const challengePeriodDuration = badgeModelKlerosData.data?.challengePeriodDuration

  const badgeModelMetadata = badgeModelKlerosData.data?.badgeModelKlerosRegistrationMetadata

  if (!badgeModelMetadata) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const badgeCriteria =
    's3Url' in badgeModelMetadata.fileURI ? badgeModelMetadata.fileURI.s3Url : ''

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
      <Typography fontWeight={800} variant="dAppTitle3">
        {t('badge.type.mint.depositRequired')}
      </Typography>
      <Box display="flex" flex={1} gap={4}>
        <Stack flex={1} gap={1} sx={{ borderBottom: '1px solid white', margin: 'auto' }}>
          <Typography variant="dAppTitle2">{t('badge.type.mint.depositCost')}</Typography>
          <Typography variant="body2">
            {costs.klerosCost} {networkConfig.token}
          </Typography>
        </Stack>
        <Box display="flex" flex={1} gap={2}>
          <ReportProblemOutlinedIcon sx={{ m: 'auto' }} />
          <MarkdownTypography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 300,
              '& a': { textDecoration: 'underline !important' },
            }}
            variant="subtitle2"
          >
            {t('badge.type.mint.depositDisclaimer', {
              docsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
              challengePeriodDuration: challengePeriodDuration / 60 / 60,
              timeUnit: 'days',
            })}
          </MarkdownTypography>
        </Box>
      </Box>
      <Divider />
      <Stack
        flex={1}
        gap={1}
        sx={{
          borderBottom: '1px solid white',
          justifyContent: 'flex-end',
          width: 'fit-content',
          minWidth: '50%',
        }}
      >
        <Typography variant="dAppTitle2">{t('badge.type.mint.mintCost')}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ display: 'flex' }} variant="body2">
            {costs.mintCost} {networkConfig.token}
          </Typography>
        </Box>
      </Stack>

      <Typography textAlign="center" variant="subtitle2">
        {t('badge.type.mint.makeSure')}
        <a
          href={badgeCriteria as string}
          rel="noreferrer"
          style={{ color: colors.green }}
          target={'_blank'}
        >
          {t('badge.type.mint.curationCriteria')}
        </a>
        {t('badge.type.mint.avoidChallenges')}
      </Typography>
    </Stack>
  )
}
