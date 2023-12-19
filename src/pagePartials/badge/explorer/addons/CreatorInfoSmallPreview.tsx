'use client'
import React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
import { User } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils'

export default function CreatorInfoSmallPreview({ creator }: { creator: User }) {
  const { t } = useTranslation()

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(creator.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  /* Creator info */
  return (
    <Stack gap={2} mt={6}>
      <Typography color={colors.pink} textTransform="uppercase" variant="titleMedium">
        {t('explorer.preview.creator.createdBy')}
      </Typography>

      <TBUserInfoExpandablePreview
        color={colors.purple}
        metadata={creatorMetadata}
        userAddress={creator.id as WCAddress}
      />
    </Stack>
  )
}
