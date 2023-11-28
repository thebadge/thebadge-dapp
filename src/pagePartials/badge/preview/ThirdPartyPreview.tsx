import * as React from 'react'

import { Skeleton, Stack } from '@mui/material'

import { BadgeView } from './BadgeView'
import DiplomaView from './DiplomaView'
import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

type Props = {
  modelId: string
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export const ThirdPartyPreview = ({ additionalData, badgeUrl, modelId }: Props) => {
  const template = useBadgeModelTemplate(modelId)

  if (template === BadgeModelTemplate.Diploma) {
    return (
      <Stack alignItems={'center'} margin={1}>
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
    <Stack alignItems={'center'} margin={1}>
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        <BadgeView additionalData={additionalData} badgeUrl={badgeUrl} modelId={modelId} />
      </SafeSuspense>
    </Stack>
  )
}
