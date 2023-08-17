import React from 'react'

import { Divider, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoSmallPreview from '@/src/components/common/TBUserInfoSmallPreview'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
import { User } from '@/types/generated/subgraph'

export default function CreatorInfoSmallPreview({ creator }: { creator: User }) {
  const { t } = useTranslation()

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(creator.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  /* Creator info */
  return (
    <Stack gap={2} mt={6}>
      <Typography color={colors.pink} textTransform="uppercase" variant="dAppTitle2">
        {t('explorer.preview.creator.createdBy')}
      </Typography>

      <TBUserInfoSmallPreview
        color={colors.purple}
        isVerified={creator?.isVerified}
        metadata={creatorMetadata}
        userAddress={creator.id}
      />

      <Typography variant="dAppTitle2">{creatorMetadata?.description}</Typography>

      <Divider color={colors.white} />
    </Stack>
  )
}
