import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useBadgeModelThirdPartyMetadata } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import MintCostThirdParty from '@/src/pagePartials/badge/mint/steps/preview/thirdParty/MintCostThirdParty'
import { BadgeThirdPartyPreviewGenerator } from '@/src/pagePartials/badge/preview/BadgeThirdPartyPreviewGenerator'
import { createThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function SubmitPreviewThirdParty() {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { setValue, watch } = useFormContext<MintThirdPartySchemaType>() // retrieve all hook methods
  const modelId = useModelIdParam()
  const requiredBadgeDataMetadata = useBadgeModelThirdPartyMetadata(modelId)

  const watchedRequiredData = watch('requiredData') || {}

  const values = createThirdPartyValuesObject(
    watchedRequiredData,
    requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns,
  )

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Box>
        <SafeSuspense>
          <BadgeThirdPartyPreviewGenerator
            additionalData={{
              ...values,
            }}
            badgeUrl={`${APP_URL}/${modelId}/${address}`}
            modelId={modelId}
            setValue={setValue}
            title={t('badge.model.mint.previewTitle')}
          />
        </SafeSuspense>
      </Box>
      <SafeSuspense>
        <MintCostThirdParty />
      </SafeSuspense>
    </Stack>
  )
}
