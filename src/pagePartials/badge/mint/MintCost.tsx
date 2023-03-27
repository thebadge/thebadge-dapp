import { useSearchParams } from 'next/navigation'
import * as React from 'react'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from 'thebadge-ui-library'

import { getNetworkConfig } from '@/src/config/web3'
import { DOCS_URL } from '@/src/constants/common'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

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

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: typeId })
  const challengePeriodDuration = badgeType.data?.badgeType?.klerosBadge?.challengePeriodDuration

  const klerosMetadataURL = badgeType.data?.badgeType?.klerosBadge?.klerosMetadataURL

  if (!klerosMetadataURL) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const metadata = useS3Metadata<{ content: KlerosListStructure }>(klerosMetadataURL)
  const fileURI = metadata?.data?.content.fileURI

  if (!fileURI) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const criteriaUrl = 's3Url' in fileURI ? fileURI.s3Url : ''

  // 👇	ReactMarkdown needs to have the children as a prop
  /* eslint-disable react/no-children-prop */
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
          {/* ReactMarkdown want it in this way  */}
          <Typography
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& a': { textDecoration: 'underline !important' },
            }}
            variant="subtitle2"
          >
            <ReactMarkdown
              children={t('badge.type.mint.depositDisclaimer', {
                docsUrl: DOCS_URL + '/thebadge-documentation/overview/how-it-works/challenge',
                challengePeriodDuration: challengePeriodDuration / 60 / 60,
                timeUnit: 'days',
              })}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank">
                    here
                  </a>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            />
          </Typography>
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
        <a href={criteriaUrl} rel="noreferrer" style={{ color: colors.green }} target={'_blank'}>
          Listing Criteria
        </a>
        {t('badge.type.mint.avoidChallenges')}
      </Typography>
    </Stack>
  )
}
