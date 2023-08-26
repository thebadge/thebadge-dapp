import React from 'react'

import { Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import {
  useRegistrationBadgeModelKlerosMetadata,
  useRemovalBadgeModelKlerosMetadata,
} from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'

export default function CurationCriteriaLink({
  badgeModelId,
  isRemoval,
  type,
}: {
  badgeModelId: string
  type: 'challenge' | 'addEvidence' | 'curate'
  isRemoval?: boolean
}) {
  const { t } = useTranslation()

  const badgeModelRegistrationKlerosData = useRegistrationBadgeModelKlerosMetadata(badgeModelId)
  const badgeModelRemovalKlerosData = useRemovalBadgeModelKlerosMetadata(badgeModelId)

  if (!badgeModelRemovalKlerosData.data && !badgeModelRegistrationKlerosData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const badgeRegistrationMetadata =
    badgeModelRegistrationKlerosData.data?.badgeModelKlerosRegistrationMetadata
  const badgeRemovalMetadata = badgeModelRemovalKlerosData.data?.badgeModelKlerosRemovalMetadata

  if (!badgeRegistrationMetadata || !badgeRemovalMetadata) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  const badgeRegistrationCriteria = badgeModelRegistrationKlerosData.data?.badgeRegistrationCriteria
  const badgeRemovalCriteria = badgeModelRemovalKlerosData.data?.badgeRemovalCriteria

  return (
    <Typography fontSize={14} textAlign="center" variant="dAppBody1">
      {t(`badge.${type}.criteriaLink.readCriteria`)}
      <a
        href={isRemoval ? badgeRemovalCriteria : badgeRegistrationCriteria}
        rel="noreferrer"
        style={{ textDecoration: 'underline' }}
        target={'_blank'}
      >
        {t(`badge.${type}.criteriaLink.curationCriteria`)}
      </a>
      {t(`badge.${type}.criteriaLink.toAvoid`)}
    </Typography>
  )
}
