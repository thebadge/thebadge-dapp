import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import ManagementProfile from '@/src/pagePartials/profile/ManagementProfile'
import UserProfile from '@/src/pagePartials/profile/UserProfile'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'
import ProfileContextProvider from '@/src/providers/ProfileProvider'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export enum ProfileType {
  USER_PROFILE = 'userProfile',
  MANAGEMENT_PROFILE = 'managementProfile',
}

const ProfileSelector = () => {
  const { t } = useTranslation()

  const params = useSearchParams()
  const selectedProfile = params?.get('profileType')

  const { address: connectedWalletAddress, readOnlyChainId } = useWeb3Connection()

  const mainProfileTab = (
    <Typography
      color={
        !selectedProfile || selectedProfile === ProfileType.USER_PROFILE
          ? 'text.primary'
          : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.user.title')}
    </Typography>
  )

  const managementProfileTab = (
    <Typography
      color={selectedProfile === ProfileType.MANAGEMENT_PROFILE ? 'text.primary' : 'text.disabled'}
      textTransform="uppercase"
    >
      {t('profile.thirdParty.title')}
    </Typography>
  )

  const displayFullProfile = () => {
    return (
      <ProfileContextProvider>
        <SafeSuspense>
          <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
            <Box
              display="flex"
              flex={1}
              flexDirection="row"
              justifyContent="space-evenly"
              width="100%"
            >
              <Link
                href={generateProfileUrl({
                  profileType: ProfileType.USER_PROFILE,
                  address: connectedWalletAddress ? connectedWalletAddress : '',
                  connectedChainId: readOnlyChainId,
                })}
              >
                {mainProfileTab}
              </Link>
              <Link
                href={generateProfileUrl({
                  profileType: ProfileType.MANAGEMENT_PROFILE,
                  address: connectedWalletAddress ? connectedWalletAddress : '',
                  connectedChainId: readOnlyChainId,
                })}
              >
                {managementProfileTab}
              </Link>
            </Box>
          </Stack>
          <SafeSuspense fallback={<InfoPreviewSkeleton />}>
            <InfoPreview address={connectedWalletAddress || ''} />
          </SafeSuspense>
          {/* Profile Content */}
          {!selectedProfile && <UserProfile />}
          {selectedProfile === ProfileType.USER_PROFILE && <UserProfile />}
          {selectedProfile === ProfileType.MANAGEMENT_PROFILE && <ManagementProfile />}
        </SafeSuspense>
      </ProfileContextProvider>
    )
  }

  return displayFullProfile()
}

export default ProfileSelector
