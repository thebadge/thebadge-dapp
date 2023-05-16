import React from 'react'

import { Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import useBadgeModel from '@/src/hooks/subgraph/useBadgeType'

export default function CurationCriteriaLink({ badgeTypeId }: { badgeTypeId: string }) {
  const { t } = useTranslation()

  const badgeTypeData = useBadgeModel(badgeTypeId)

  if (
    badgeTypeData.error ||
    !badgeTypeData.data?.badgeModel ||
    !badgeTypeData.data?.badgeModelMetadata
  ) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const badgeModelMetadata = badgeTypeData.data?.badgeModelMetadata

  if (!badgeModelMetadata) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const badgeCriteria =
    's3Url' in badgeModelMetadata.fileURI ? badgeModelMetadata.fileURI.s3Url : ''

  return (
    <Typography fontSize={14} variant="dAppBody1">
      {t('badge.challenge.modal.readCriteria')}
      <a
        href={badgeCriteria}
        rel="noreferrer"
        style={{ textDecoration: 'underline' }}
        target={'_blank'}
      >
        {t('badge.challenge.modal.curationCriteria')}
      </a>
      {t('badge.challenge.modal.toAvoid')}
    </Typography>
  )
}
