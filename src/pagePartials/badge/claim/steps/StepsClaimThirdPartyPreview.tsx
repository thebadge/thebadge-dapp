import * as React from 'react'
import { useRef } from 'react'

import { Box, Stack } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useFormContext } from 'react-hook-form'

import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'
import { BadgePreviewGenerator } from '@/src/pagePartials/badge/preview/BadgePreviewGenerator'

export const StepClaimThirdPartyPreview = () => {
  const { t } = useTranslation()
  const badgePreviewRef = useRef<HTMLDivElement>()
  const { setValue } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  const modelId = useModelIdParam()

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Box ref={badgePreviewRef}>
        <BadgePreviewGenerator
          badgePreviewRef={badgePreviewRef}
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.claim.thirdParty.preview.title')}
        />
      </Box>
    </Stack>
  )
}
