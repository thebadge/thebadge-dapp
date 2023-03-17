import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgesYouOwnList from '@/src/pagePartials/profile/myProfile/BadgesYouOwnList'

type Props = {
  address: string
}

const SharedProfile = ({ address }: Props) => {
  const { t } = useTranslation()

  return (
    <SafeSuspense>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={'text.primary'}>{t('profile.titleOf', address)}</Typography>
      </Stack>
      <BadgesYouOwnList address={address} />
    </SafeSuspense>
  )
}

export default SharedProfile
