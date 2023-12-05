import * as React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/generators/BadgeThirdPartyPreviewGenerator'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const { badgeId, contract, modelId } = useClaimParams()
  const { address, chainId } = parsePrefixedAddress(contract)
  const badgePreviewUrl = useBadgePreviewUrl(badgeId, address, chainId)
  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(`${badgeId}` || '')

  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <SafeSuspense>
        <BadgeThirdPartyPreviewGenerator
          additionalData={{ ...values }}
          badgeUrl={badgePreviewUrl}
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </SafeSuspense>
    </Stack>
  )
}
