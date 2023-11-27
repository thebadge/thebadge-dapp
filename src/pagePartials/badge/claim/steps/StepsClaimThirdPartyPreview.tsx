import * as React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeIDFromULID from '@/src/hooks/nextjs/useBadgeIDFromULID'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/generators/BadgeThirdPartyPreviewGenerator'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const { badgeModelId } = useModelIdParam()
  const badgeId = useBadgeIDFromULID()

  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(`${badgeId.data}` || '')

  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <SafeSuspense>
        <BadgeThirdPartyPreviewGenerator
          additionalData={{ ...values }}
          modelId={badgeModelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </SafeSuspense>
    </Stack>
  )
}
