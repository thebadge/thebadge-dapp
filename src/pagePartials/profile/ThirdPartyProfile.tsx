import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import MyProfileSection from '@/src/pagePartials/profile/myProfile/MyProfileSection'
import ProfileContextProvider from '@/src/providers/ProfileProvider'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export enum ThirdPartyProfileFilter {
  MANAGE_ACCOUNT = 'manageAccount',
  MANAGE_BADGES = 'manageBadges',
}

const ThirdPartyProfile = () => {
  const { t } = useTranslation()
  const params = useSearchParams()
  const selectedFilter = params.get('filter')

  const manageAccountTab = (
    <Typography
      color={
        selectedFilter === ThirdPartyProfileFilter.MANAGE_ACCOUNT ? 'text.primary' : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.thirdPartyProfile.tab1')}
    </Typography>
  )

  const manageBadgesTab = (
    <Typography
      color={
        selectedFilter === ThirdPartyProfileFilter.MANAGE_BADGES ? 'text.primary' : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.thirdPartyProfile.tab2')}
    </Typography>
  )

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
            {/* manage account */}
            <Link
              href={generateProfileUrl({
                profileType: ProfileType.THIRD_PARTY_PROFILE,
                filter: ThirdPartyProfileFilter.MANAGE_ACCOUNT,
              })}
            >
              {manageAccountTab}
            </Link>

            {/* manage badges */}
            <Link
              href={generateProfileUrl({
                profileType: ProfileType.THIRD_PARTY_PROFILE,
                filter: ThirdPartyProfileFilter.MANAGE_BADGES,
              })}
            >
              {manageBadgesTab}
            </Link>
          </Box>
        </Stack>
        {/* Profile Content */}
        {!selectedFilter && <MyProfileSection />}
        {selectedFilter === ThirdPartyProfileFilter.MANAGE_ACCOUNT && <div>MANAGE ACCOUNT WIP</div>}
        {selectedFilter === ThirdPartyProfileFilter.MANAGE_BADGES && <div>MANAGE BADGES WIP</div>}
      </SafeSuspense>
    </ProfileContextProvider>
  )
}

export default ThirdPartyProfile
