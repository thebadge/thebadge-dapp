import * as React from 'react'

import { Skeleton, Stack, Typography } from '@mui/material'
import { UseFormSetValue } from 'react-hook-form'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { BadgePreviewGenerator } from '@/src/pagePartials/badge/preview/BadgePreviewGenerator'
import DiplomaPreviewGenerator from '@/src/pagePartials/badge/preview/DiplomaPreviewGenerator'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

type Props = {
  title: string
  modelId: string
  setValue: UseFormSetValue<any>
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export const BadgeThirdPartyPreviewGenerator = ({
  additionalData,
  badgeUrl,
  modelId,
  setValue,
  title,
}: Props) => {
  const template = useBadgeModelTemplate(modelId)

  if (template === BadgeModelTemplate.Diploma) {
    return (
      <Stack alignItems={'center'} gap={3} margin={1}>
        <Typography>{title}</Typography>
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
          <DiplomaPreviewGenerator
            additionalData={additionalData}
            badgeUrl={badgeUrl}
            modelId={modelId}
            setValue={setValue}
          />
        </SafeSuspense>
      </Stack>
    )
  }

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Typography>{title}</Typography>
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        <BadgePreviewGenerator
          additionalData={additionalData}
          badgeUrl={badgeUrl}
          modelId={modelId}
          setValue={setValue}
        />
      </SafeSuspense>
    </Stack>
  )
}
