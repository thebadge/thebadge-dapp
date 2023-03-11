import { useSearchParams } from 'next/navigation'

import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Countdown from 'react-countdown'
import { SectionLayout, colors } from 'thebadge-ui-library'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import ExploreOtherBadges from '@/src/pagePartials/profile/ExploreOtherBadges'
import NearToExpire from '@/src/pagePartials/profile/NearToExpire'
import Pending from '@/src/pagePartials/profile/Pending'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

type Props = {
  address: string
}

const Profile = ({ address }: Props) => {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const theme = useTheme()
  const params = useSearchParams()

  const filterType = params.get('filter')
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userWithBadges = gql.useUserBadgesById({ ownerAddress: address })
  const badges = userWithBadges.data?.user?.badges || []

  function handleClaimIt(badgeId: string, address: string) {
    klerosController.claimBadge(badgeId, address)
  }

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
          <LinkWithTranslation pathname={`/profile`} queryParams={{ filter: 'createdBadges' }}>
            <Typography color={filterType === 'createdBadges' ? 'text.primary' : 'text.disabled'}>
              {t('profile.tab3')}
            </Typography>
          </LinkWithTranslation>
        </Box>
      </Stack>
      <Box display="flex" flex={1} flexDirection="row">
        {/* Near to expire badges */}
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.greyBackground}
          components={[
            {
              component: <NearToExpire />,
            },
          ]}
          sx={{
            boxShadow: `0px 0px 6px ${theme.palette.mainMenu.boxShadow.main}`,
            borderWidth: 'inherit !important',
            mb: '3rem',
            flex: 3,
            borderRadius: '15px !important',
          }}
        />

        {/* In review badges */}
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.transparent}
          components={[
            {
              component: <Pending />,
            },
          ]}
          sx={{
            mb: '3rem',
            flex: 2,
            borderRadius: '15px !important',
          }}
        />
      </Box>

      <ExploreOtherBadges />
      <Stack gap={2} mt={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedOutlinedIcon />
          <Typography textAlign="center" variant="title4">
            {t('profile.badgesYouOwn')}
          </Typography>
        </Box>
        {/*TODO Add the real display UI */}
        {badges.map((bt) => {
          const needClaim =
            bt.status === 'InReview' && dayjs().isAfter(dayjs.unix(bt.reviewDueDate).toDate())

          return (
            <Box
              key={bt.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                border: `1px solid ${colors.green}`,
                borderRadius: 2,
                p: 2,
              }}
            >
              {bt.status === 'Approved' ? (
                <LinkWithTranslation pathname={`/badge/${bt.badgeType.id}/${address}`}>
                  Minted badge {bt.id}
                </LinkWithTranslation>
              ) : (
                <Typography>Minted badge {bt.id}</Typography>
              )}
              <Typography>Status: {bt.status}</Typography>
              <Typography>
                Review ends in <Countdown date={dayjs.unix(bt.reviewDueDate).toDate()} />
              </Typography>
              <Typography>BadgeType Id: {bt.badgeType.id}</Typography>
              <Typography>BadgeType Minted Amount: {bt.badgeType.badgesMintedAmount}</Typography>

              {needClaim && (
                <Box>
                  <Button
                    onClick={() => handleClaimIt(bt.badgeType.id, address)}
                    variant="contained"
                  >
                    Claim It
                  </Button>
                </Box>
              )}
            </Box>
          )
        })}
      </Stack>
    </SafeSuspense>
  )
}

export default Profile
