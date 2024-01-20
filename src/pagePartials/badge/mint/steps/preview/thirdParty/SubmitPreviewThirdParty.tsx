import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useBadgeModelThirdPartyMetadata } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import useEstimateBadgeId from '@/src/hooks/theBadge/useEstimateBadgeId'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import MintCostThirdParty from '@/src/pagePartials/badge/mint/steps/preview/thirdParty/MintCostThirdParty'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/generators/BadgeThirdPartyPreviewGenerator'
import { createThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function SubmitPreviewThirdParty({ hideCost }: { hideCost?: boolean }) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const { setValue, watch } = useFormContext<MintThirdPartySchemaType>() // retrieve all hook methods
  const { badgeModelId, contract } = useModelIdParam()
  const requiredBadgeDataMetadata = useBadgeModelThirdPartyMetadata(badgeModelId)
  const { data: estimatedBadgeId } = useEstimateBadgeId()

  const watchedRequiredData = watch('requiredData') || {}

  const values = createThirdPartyValuesObject(
    watchedRequiredData,
    requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns,
  )
  const badgeModelData = useBadgeModel(badgeModelId)
  const template = useBadgeModelTemplate(badgeModelId, contract)
  if (badgeModelData.error || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const estimatedBadgeIdForPreview = estimatedBadgeId ? estimatedBadgeId.toString() : '0'
  const urlsData = useBadgePreviewUrl(
    estimatedBadgeIdForPreview,
    badgeModelData.data.badgeModel.contractAddress,
    appChainId,
  )
  const previewUrls = urlsData.data

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Box>
        <SafeSuspense>
          <BadgeThirdPartyPreviewGenerator
            additionalData={{
              ...values,
            }}
            badgeUrl={previewUrls?.shortPreviewUrl}
            modelId={badgeModelId}
            setValue={setValue}
            title={t('badge.model.mint.previewTitle', {
              badgeModelTemplate: template,
            })}
          />
        </SafeSuspense>
      </Box>
      {!hideCost && (
        <SafeSuspense>
          <MintCostThirdParty />
        </SafeSuspense>
      )}
    </Stack>
  )
}
