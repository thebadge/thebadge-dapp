import React from 'react'

import { Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

export default function ListingCriteriaLink({ badgeTypeId }: { badgeTypeId: string }) {
  const { t } = useTranslation()

  const { appChainId } = useWeb3Connection()

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

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

  return (
    <Typography variant="subtitle2">
      {t('badge.challenge.modal.readCriteria')}
      <a
        href={criteriaUrl}
        rel="noreferrer"
        style={{ textDecoration: 'underline' }}
        target={'_blank'}
      >
        {t('badge.challenge.modal.listingCriteria')}
      </a>
      {t('badge.challenge.modal.toAvoid')}
    </Typography>
  )
}
