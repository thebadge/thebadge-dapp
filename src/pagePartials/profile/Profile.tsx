import { useSearchParams } from 'next/navigation'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import BadgesCreatedSection from '@/src/pagePartials/profile/created/BadgesCreatedSection'
import MyProfileSection from '@/src/pagePartials/profile/myProfile/MyProfileSection'
import BadgesIAmReviewingSection from '@/src/pagePartials/profile/reviewing/BadgesIAmReviewingSection'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'

export enum ProfileFilter {
  BADGES_I_AM_REVIEWING = 'badgesIAmReviewing',
  CREATED_BADGES = 'createdBadges',
}

const Profile = () => {
  const { t } = useTranslation()

  const params = useSearchParams()
  const selectedFilter = params.get('filter')

  const userData = useCurrentUser()
  const user = userData.data

  return (
    <SafeSuspense>
      <SafeSuspense fallback={<InfoPreviewSkeleton />}>
        <InfoPreview address={user?.id || ''} />
      </SafeSuspense>

      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-evenly" width="100%">
          <LinkWithTranslation pathname={`/profile`}>
            <Typography
              color={!selectedFilter ? 'text.primary' : 'text.disabled'}
              textTransform="uppercase"
            >
              {t('profile.tab1')}
            </Typography>
          </LinkWithTranslation>
          <LinkWithTranslation
            pathname={`/profile`}
            queryParams={{ filter: ProfileFilter.BADGES_I_AM_REVIEWING }}
          >
            <Typography
              color={
                selectedFilter === ProfileFilter.BADGES_I_AM_REVIEWING
                  ? 'text.primary'
                  : 'text.disabled'
              }
              textTransform="uppercase"
            >
              {t('profile.tab2')}
            </Typography>
          </LinkWithTranslation>
          <LinkWithTranslation
            pathname={`/profile`}
            queryParams={{ filter: ProfileFilter.CREATED_BADGES }}
          >
            <Typography
              color={
                selectedFilter === ProfileFilter.CREATED_BADGES ? 'text.primary' : 'text.disabled'
              }
              textTransform="uppercase"
            >
              {t('profile.tab3')}
            </Typography>
          </LinkWithTranslation>
        </Box>
      </Stack>

      {!selectedFilter && <MyProfileSection />}
      {selectedFilter === ProfileFilter.BADGES_I_AM_REVIEWING && <BadgesIAmReviewingSection />}
      {selectedFilter === ProfileFilter.CREATED_BADGES && <BadgesCreatedSection />}
    </SafeSuspense>
  )
}

export default Profile
