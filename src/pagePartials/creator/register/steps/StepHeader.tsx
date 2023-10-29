import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'

export default function StepHeader() {
  const { t } = useTranslation()

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
      <Typography color={colors.purple} textAlign="center" variant="title2">
        {t('creator.register.title')}
      </Typography>

      <MarkdownTypography textAlign="justify" variant="body3" width="85%">
        {t(`creator.register.subTitle`)}
      </MarkdownTypography>
    </Stack>
  )
}
