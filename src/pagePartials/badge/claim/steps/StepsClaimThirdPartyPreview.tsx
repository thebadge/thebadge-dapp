import * as React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/generators/BadgeThirdPartyPreviewGenerator'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const { badgeId, contract, modelId } = useClaimParams()
  const { address, chainId } = parsePrefixedAddress(contract)

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
          badgeUrl={
            APP_URL +
            generateBadgePreviewUrl(badgeId, {
              theBadgeContractAddress: address,
              connectedChainId: chainId,
            })
          }
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </SafeSuspense>
    </Stack>
  )
}
