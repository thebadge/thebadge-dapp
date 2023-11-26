import * as React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgePreviewGenerator } from '@/src/pagePartials/badge/preview/BadgePreviewGenerator'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const modelId = useModelIdParam()

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        <BadgePreviewGenerator
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </SafeSuspense>
    </Stack>
  )
}
