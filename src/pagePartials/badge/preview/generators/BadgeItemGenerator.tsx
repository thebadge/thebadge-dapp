import React from 'react'

import { Skeleton, Stack } from '@mui/material'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { BadgeView } from '@/src/pagePartials/badge/preview/BadgeView'
import DiplomaView from '@/src/pagePartials/badge/preview/DiplomaView'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

type BadgeItemProps = {
  badgeId: string
  onClick: VoidFunction
}
export default function BadgeItemGenerator({ badgeId, onClick }: BadgeItemProps) {
  // Safeguard to use the contract in the url
  // If this hooks run under a page that has the "contract" query params it must use it
  const { contract } = useBadgeIdParam()
  const badgeById = useBadgeById(badgeId, contract)

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }
  const modelId = badge.badgeModel.id

  const template = useBadgeModelTemplate(modelId, contract)
  const badgeUrl = badge.badgeMetadata.external_link
  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(
    `${badge.id}` || '',
    badge?.contractAddress,
  )
  const additionalData = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  if (template === BadgeModelTemplate.Diploma) {
    return (
      <Stack
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          flex: 2,
          justifyContent: 'center',
          display: 'flex',
          alignSelf: 'center',
        }}
      >
        <SafeSuspense
          fallback={
            <Skeleton
              animation="wave"
              height={400}
              sx={{ m: 'auto' }}
              variant="rounded"
              width={655}
            />
          }
        >
          <DiplomaView additionalData={additionalData} badgeUrl={badgeUrl} modelId={modelId} />
        </SafeSuspense>
      </Stack>
    )
  }

  return (
    <Stack
      alignItems={'center'}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        alignSelf: 'center',
      }}
    >
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        <BadgeView
          additionalData={additionalData}
          badgeUrl={badgeUrl}
          modelId={modelId}
          size={'small'}
        />
      </SafeSuspense>
    </Stack>
  )
}
