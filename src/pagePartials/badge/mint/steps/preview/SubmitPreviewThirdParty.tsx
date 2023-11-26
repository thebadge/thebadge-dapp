import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import MintCostThirdParty from '@/src/pagePartials/badge/mint/steps/preview/MintCostThirdParty'
import { BadgePreviewGenerator } from '@/src/pagePartials/badge/preview/BadgePreviewGenerator'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function SubmitPreviewThirdParty() {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { setValue } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods
  const modelId = useModelIdParam()

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Box>
        <SafeSuspense fallback={<BadgePreviewLoading />}>
          <BadgePreviewGenerator
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
