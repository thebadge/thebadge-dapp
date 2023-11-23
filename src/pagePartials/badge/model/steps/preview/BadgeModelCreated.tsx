import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { Divider, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { StepButton } from '@/src/pagePartials/badge/model/steps/StepFooter'
import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import { cleanCreateModelFormValues } from '@/src/pagePartials/badge/model/utils'
import { NormalProfileFilter } from '@/src/pagePartials/profile/UserProfile'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export default function BadgeModelCreated() {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    return () => cleanCreateModelFormValues()
  }, [])

  return (
    <Stack alignItems="center" gap={3} justifyContent="center">
      <BadgeModelCreationPreview />
      <Stack display="flex" flex="1" gap={1} justifyContent="center" maxWidth={480} mt={2}>
        <Typography fontSize={'14px !important'} textAlign="center" variant="body4">
          {t('badge.model.create.created.footer')}
        </Typography>
        <Divider color={colors.white} />
      </Stack>
      <StepButton
        color={'primary'}
        onClick={() =>
          router.push(generateProfileUrl({ filter: NormalProfileFilter.CREATED_BADGES }))
        }
        sx={{ m: 'auto' }}
        variant="contained"
      >
        {t('badge.model.create.created.goToProfile')}
      </StepButton>
    </Stack>
  )
}
