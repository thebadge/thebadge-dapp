import React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
import { User } from '@/types/generated/subgraph'

export default function CreatorInfoSmallPreview({ creator }: { creator: User }) {
  const { t } = useTranslation()

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(creator.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content
  const isVerified = useIsUserVerified(creator.id, 'kleros')

  /* Creator info */
  return (
    <Stack gap={2} mt={6}>
      <Typography color={colors.pink} textTransform="uppercase" variant="titleMedium">
        {t('explorer.preview.creator.createdBy')}
      </Typography>

      <TBUserInfoExpandablePreview
        color={colors.purple}
        isVerified={isVerified.data}
        metadata={creatorMetadata}
        userAddress={creator.id}
      />
    </Stack>
  )
}
