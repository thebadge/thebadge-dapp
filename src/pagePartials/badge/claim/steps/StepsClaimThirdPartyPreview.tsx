import * as React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/BadgeThirdPartyPreviewGenerator'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const modelId = useModelIdParam()

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <SafeSuspense>
        <BadgeThirdPartyPreviewGenerator
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </SafeSuspense>
    </Stack>
  )
}
