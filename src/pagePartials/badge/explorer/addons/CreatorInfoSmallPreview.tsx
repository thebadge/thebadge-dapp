import React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { User } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils'

export default function CreatorInfoSmallPreview({ creator }: { creator: User }) {
  const { t } = useTranslation()

  const userMetadata = useUserMetadata(creator.id, creator.metadataUri || '')

  /* Creator info */
  return (
    <Stack gap={2} mt={6}>
      <Typography color={colors.pink} textTransform="uppercase" variant="titleMedium">
        {t('explorer.preview.creator.createdBy')}
      </Typography>

      <TBUserInfoExpandablePreview
        color={colors.purple}
        metadata={userMetadata}
        userAddress={creator.id as WCAddress}
      />
    </Stack>
  )
}
