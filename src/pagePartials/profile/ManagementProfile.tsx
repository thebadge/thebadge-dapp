import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import ManageBadges from '@/src/pagePartials/profile/myProfile/ManageBadges'
import ProfileContextProvider from '@/src/providers/ProfileProvider'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export enum ManagementProfileFilter {
  MANAGE_ACCOUNT = 'manageAccount',
  MANAGE_BADGES = 'manageBadges',
}

const ManagementProfile = () => {
  const { t } = useTranslation()
  const params = useSearchParams()
  const selectedFilter = params?.get('filter')

  const manageBadgesTab = (
    <Typography
      color={
        !selectedFilter || selectedFilter === ManagementProfileFilter.MANAGE_BADGES
          ? 'text.primary'
          : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.thirdParty.tab2')}
    </Typography>
  )

  const manageAccountTab = (
    <Typography
      color={
        selectedFilter === ManagementProfileFilter.MANAGE_ACCOUNT ? 'text.primary' : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.thirdParty.tab1')}
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
            {/* manage badges */}
            <Link
              href={generateProfileUrl({
                profileType: ProfileType.MANAGEMENT_PROFILE,
                filter: ManagementProfileFilter.MANAGE_BADGES,
              })}
            >
              {manageBadgesTab}
            </Link>

            {/* manage account */}
            <div aria-disabled={true}>{manageAccountTab}</div>
          </Box>
        </Stack>
        {/* Profile Content */}
        {!selectedFilter && <ManageBadges />}
        {selectedFilter === ManagementProfileFilter.MANAGE_BADGES && <ManageBadges />}
        {selectedFilter === ManagementProfileFilter.MANAGE_ACCOUNT && <div>MANAGE ACCOUNT WIP</div>}
      </SafeSuspense>
    </ProfileContextProvider>
  )
}

export default ManagementProfile
