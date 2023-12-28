import React from 'react'

import { Skeleton, Stack } from '@mui/material'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import { BadgeView } from '@/src/pagePartials/badge/preview/BadgeView'
import DiplomaView from '@/src/pagePartials/badge/preview/DiplomaView'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'
import { Badge } from '@/types/generated/subgraph'

type BadgeItemProps = {
  badge: Badge
  onClick: VoidFunction
}
export default function BadgeItemGenerator({ badge, onClick }: BadgeItemProps) {
  const badgeModel = badge?.badgeModel
  const modelId = badgeModel?.id
  const template = useBadgeModelTemplate(modelId)
  const urlsData = useBadgePreviewUrl(badge.id, badge?.contractAddress)
  const badgeUrl = urlsData.data?.shortPreviewUrl
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
        alignItems={'center'}
        onClick={onClick}
        sx={{ cursor: 'pointer', width: '100%', maxWidth: 'calc(50% - 18px)' }}
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
      sx={{ cursor: 'pointer', maxWidth: 'calc(25% - 18px)', width: '100%' }}
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
