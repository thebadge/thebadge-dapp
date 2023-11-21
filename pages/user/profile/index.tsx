import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import ProfileSelector from '@/src/pagePartials/profile/ProfileSelector'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { NextPageWithLayout } from '@/types/next'

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()

  if (!address) {
    return (
      <>
        <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
          <Typography textAlign="center" variant="subtitle2">
            {t('errors.connectWallet')}
          </Typography>
        </Stack>
      </>
    )
  }
  return <ProfileSelector />
}

export default ProfilePage
