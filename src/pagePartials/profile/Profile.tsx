import { useSearchParams } from 'next/navigation'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgesCreatedSection from '@/src/pagePartials/profile/created/BadgesCreatedSection'
import BadgesInReviewSection from '@/src/pagePartials/profile/inReview/BadgesInReviewSection'
import MyProfileSection from '@/src/pagePartials/profile/myProfile/MyProfileSection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

const Profile = () => {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()

  const params = useSearchParams()
  const filterType = params.get('filter')

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userById = gql.useUserById({ id: address || '' })
  const user = userById.data?.user

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
          {(
            <LinkWithTranslation pathname={`/profile`} queryParams={{ filter: 'createdBadges' }}>
              <Typography color={filterType === 'createdBadges' ? 'text.primary' : 'text.disabled'}>
                {t('profile.tab3')}
              </Typography>
            </LinkWithTranslation>
          )}
        </Box>
      </Stack>
      {!filterType && <MyProfileSection />}
      {filterType === 'badgesInReview' && <BadgesInReviewSection />}
      {filterType === 'createdBadges' && <BadgesCreatedSection />}
    </SafeSuspense>
  )
}

export default Profile
