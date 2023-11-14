import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useIsThirdPartyUser from '@/src/hooks/theBadge/useIsThirdPartyUser'
import NormalProfile from '@/src/pagePartials/profile/NormalProfile'
import ThirdPartyProfile from '@/src/pagePartials/profile/ThirdPartyProfile'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'
import ProfileContextProvider from '@/src/providers/ProfileProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export enum ProfileType {
  NORMAL_PROFILE = 'normalProfile',
  THIRD_PARTY_PROFILE = 'thirdPartyProfile',
}

const ProfileSelector = () => {
  const { t } = useTranslation()

  const params = useSearchParams()
  const selectedProfile = params.get('profileType')

  const { address: connectedWalletAddress } = useWeb3Connection()
  const isThirdPartyUser = useIsThirdPartyUser(connectedWalletAddress || '')

  const mainProfileTab = (
    <Typography
      color={
        !selectedProfile || selectedProfile === ProfileType.NORMAL_PROFILE
          ? 'text.primary'
          : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.normal.title')}
    </Typography>
  )

  const thirdPartyProfileTab = (
    <Typography
      color={selectedProfile === ProfileType.THIRD_PARTY_PROFILE ? 'text.primary' : 'text.disabled'}
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
                  profileType: ProfileType.NORMAL_PROFILE,
                  address: connectedWalletAddress ? connectedWalletAddress : '',
                })}
              >
                {mainProfileTab}
              </Link>
              <Link
                href={generateProfileUrl({
                  profileType: ProfileType.THIRD_PARTY_PROFILE,
                  address: connectedWalletAddress ? connectedWalletAddress : '',
                })}
              >
                {thirdPartyProfileTab}
              </Link>
            </Box>
          </Stack>
          <SafeSuspense fallback={<InfoPreviewSkeleton />}>
            <InfoPreview address={connectedWalletAddress || ''} />
          </SafeSuspense>
          {/* Profile Content */}
          {!selectedProfile && <NormalProfile />}
          {selectedProfile === ProfileType.NORMAL_PROFILE && <NormalProfile />}
          {selectedProfile === ProfileType.THIRD_PARTY_PROFILE && <ThirdPartyProfile />}
        </SafeSuspense>
      </ProfileContextProvider>
    )
  }

  const displayNonThirdPartyProfile = () => {
    return (
      <ProfileContextProvider>
        <SafeSuspense>
          <SafeSuspense fallback={<InfoPreviewSkeleton />}>
            <InfoPreview address={connectedWalletAddress || ''} />
          </SafeSuspense>
          {/* Profile Content */}
          <NormalProfile />
        </SafeSuspense>
      </ProfileContextProvider>
    )
  }

  return isThirdPartyUser ? displayFullProfile() : displayNonThirdPartyProfile()
}

export default ProfileSelector
