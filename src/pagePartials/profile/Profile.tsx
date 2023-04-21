import { useSearchParams } from 'next/navigation'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import BadgesCreatedSection from '@/src/pagePartials/profile/created/BadgesCreatedSection'
import BadgesInReviewSection from '@/src/pagePartials/profile/inReview/BadgesInReviewSection'
import MyProfileSection from '@/src/pagePartials/profile/myProfile/MyProfileSection'
import InfoPreview from '@/src/pagePartials/profile/userInfo/InfoPreview'
import { InfoPreviewSkeleton } from '@/src/pagePartials/profile/userInfo/InfoPreview.skeleton'

const Profile = () => {
  const { t } = useTranslation()

  const params = useSearchParams()
  const filterType = params.get('filter')

  const userData = useCurrentUser()
  const user = userData.data

  return (
    <SafeSuspense>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-evenly" width="100%">
          <LinkWithTranslation pathname={`/profile`}>
            <Typography color={!filterType ? 'text.primary' : 'text.disabled'}>
              {t('profile.tab1')}
            </Typography>
          </LinkWithTranslation>
          <LinkWithTranslation pathname={`/profile`} queryParams={{ filter: 'badgesInReview' }}>
            <Typography color={filterType === 'badgesInReview' ? 'text.primary' : 'text.disabled'}>
              {t('profile.tab2')}
            </Typography>
          </LinkWithTranslation>
          {user?.isCreator && (
            <LinkWithTranslation pathname={`/profile`} queryParams={{ filter: 'createdBadges' }}>
              <Typography color={filterType === 'createdBadges' ? 'text.primary' : 'text.disabled'}>
                {t('profile.tab3')}
              </Typography>
            </LinkWithTranslation>
          )}
        </Box>
      </Stack>

      <SafeSuspense fallback={<InfoPreviewSkeleton />}>
        <InfoPreview address={user?.id || ''} />
      </SafeSuspense>
      <InfoPreviewSkeleton />
      {!filterType && <MyProfileSection />}
      {filterType === 'badgesInReview' && <BadgesInReviewSection />}
      {filterType === 'createdBadges' && <BadgesCreatedSection />}
    </SafeSuspense>
  )
}

export default Profile
