import { useSearchParams } from 'next/navigation'
import * as React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { getNetworkConfig } from '@/src/config/web3'
import { DOCS_URL } from '@/src/constants/common'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeType'
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
  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')

  if (!typeId) {
    throw `No typeId provided as URL query param`
  }
  const badgeModelData = useBadgeModel(typeId)

  if (
    badgeModelData.error ||
    !badgeModelData.data?.badgeModel ||
    !badgeModelData.data?.badgeModelMetadata
  ) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const challengePeriodDuration =
    badgeModelData.data?.badgeModel?.badgeModelKleros?.challengePeriodDuration

  const fileURI = badgeModelData.data.badgeModelMetadata

  if (!fileURI) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const criteriaUrl = 's3Url' in fileURI ? fileURI.s3Url : ''

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
      <Typography variant="dAppTitle2">Total deposit required</Typography>
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
              '& a': { textDecoration: 'underline !important' },
            }}
            variant="subtitle2"
          >
            {t('badge.type.mint.depositDisclaimer', {
              docsUrl: DOCS_URL + '/thebadge-documentation/overview/how-it-works/challenge',
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
          href={criteriaUrl as string}
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
