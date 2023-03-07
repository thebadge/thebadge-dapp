import { Box, Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Countdown from 'react-countdown'
import { colors } from 'thebadge-ui-library'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

type Props = {
  address: string
}

const Profile = ({ address }: Props) => {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()

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
        <Typography textAlign="center" variant="subtitle2">
          {t('profile.titleOf', { address })}
        </Typography>
      </Stack>
      <Box>
        <Typography color={colors.green} textAlign="center" variant="title2">
          {t('profile.badgesYouOwn')}
        </Typography>
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
      </Box>
    </SafeSuspense>
  )
}

export default Profile
