import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import ModalSubtitle from '@/src/components/modal/ModalSubtitle'
import { APP_URL } from '@/src/constants/common'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
type StepClaimThirdPartyHeaderProps = {
  creatorName: string
  creatorAddress: string
}

export const StepClaimThirdPartyHeader = ({
  creatorAddress,
  creatorName,
}: StepClaimThirdPartyHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
      <Typography color={colors.blue} textAlign="center" variant="title2">
        {t('badge.model.claim.thirdParty.header.title')}
      </Typography>
      <ModalSubtitle
        hint={''}
        showHint={false}
        subTitle={t('badge.model.claim.thirdParty.header.subTitle', {
          creatorName,
          creatorProfileUrl: APP_URL + generateProfileUrl({ address: creatorAddress }),
        })}
      />
    </Stack>
  )
}
