import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Box, Stack, Tooltip, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import BadgesCreatedSection from '@/src/pagePartials/profile/created/BadgesCreatedSection'
import MyProfileSection from '@/src/pagePartials/profile/myProfile/MyProfileSection'
import BadgesIAmReviewingSection from '@/src/pagePartials/profile/reviewing/BadgesIAmReviewingSection'
import CreatorStatistics from '@/src/pagePartials/profile/statistics/creator/CreatorStatistics'
import CuratorStatistics from '@/src/pagePartials/profile/statistics/curator/CuratorStatistics'
import UserStatistics from '@/src/pagePartials/profile/statistics/user/UserStatistics'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'
import ProfileContextProvider from '@/src/providers/ProfileProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateCreatorRegisterUrl, generateProfileUrl } from '@/src/utils/navigation/generateUrl'

export enum ProfileFilter {
  BADGES_I_AM_REVIEWING = 'badgesIAmReviewing',
  CREATED_BADGES = 'createdBadges',
}

const Profile = () => {
  const { t } = useTranslation()

  const params = useSearchParams()
  const selectedFilter = params.get('filter')

  const { address: connectedWalletAddress } = useWeb3Connection()
  const { data: user } = useCurrentUser()
  const router = useRouter()

  const mainProfileTab = (
    <Typography
      color={!selectedFilter ? 'text.primary' : 'text.disabled'}
      textTransform="uppercase"
    >
      {t('profile.tab1')}
    </Typography>
  )

  const curatedBadgesTab = (
    <Typography
      color={
        selectedFilter === ProfileFilter.BADGES_I_AM_REVIEWING ? 'text.primary' : 'text.disabled'
      }
      textTransform="uppercase"
    >
      {t('profile.tab2')}
    </Typography>
  )

  const createdBadgesTab = (
    <Typography
      color={selectedFilter === ProfileFilter.CREATED_BADGES ? 'text.primary' : 'text.disabled'}
      textTransform="uppercase"
    >
      {t('profile.tab3')}
    </Typography>
  )

  return (
    <ProfileContextProvider>
      <SafeSuspense>
        <SafeSuspense fallback={<InfoPreviewSkeleton />}>
          <InfoPreview address={connectedWalletAddress || ''} />
        </SafeSuspense>

        <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
          <Box
            display="flex"
            flex={1}
            flexDirection="row"
            justifyContent="space-evenly"
            width="100%"
          >
            {/* my badges */}
            <LinkWithTranslation pathname={generateProfileUrl()}>
              {mainProfileTab}
            </LinkWithTranslation>

            {/* curated badges */}
            <LinkWithTranslation
              pathname={generateProfileUrl()}
              queryParams={{ filter: ProfileFilter.BADGES_I_AM_REVIEWING }}
            >
              {curatedBadgesTab}
            </LinkWithTranslation>

            {/* created badges */}
            {!user?.isCreator ? (
              <Tooltip
                arrow
                title={
                  <>
                    {t('header.tooltips.becomeACreator.prefixText')}
                    <Box
                      onClick={() => router.push(generateCreatorRegisterUrl())}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {t('header.tooltips.becomeACreator.link')}
                    </Box>
                  </>
                }
              >
                <span>{createdBadgesTab}</span>
              </Tooltip>
            ) : (
              <LinkWithTranslation
                pathname={generateProfileUrl()}
                queryParams={{ filter: user?.isCreator ? ProfileFilter.CREATED_BADGES : '' }}
              >
                {createdBadgesTab}
              </LinkWithTranslation>
            )}
          </Box>
        </Stack>

        {/* Statistics */}
        {selectedFilter === ProfileFilter.CREATED_BADGES && <CreatorStatistics />}
        {selectedFilter === ProfileFilter.BADGES_I_AM_REVIEWING && <CuratorStatistics />}
        {!selectedFilter && <UserStatistics />}

        {/* Profile Content */}
        {!selectedFilter && <MyProfileSection />}
        {selectedFilter === ProfileFilter.BADGES_I_AM_REVIEWING && <BadgesIAmReviewingSection />}
        {selectedFilter === ProfileFilter.CREATED_BADGES && <BadgesCreatedSection />}
      </SafeSuspense>
    </ProfileContextProvider>
  )
}

export default Profile
