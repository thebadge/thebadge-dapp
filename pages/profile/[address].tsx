import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { colors } from 'thebadge-ui-library'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const Profile: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const searchParams = useSearchParams()
  const router = useRouter()

  const addressOnUrl = searchParams.get('address')

  if (addressOnUrl === null) {
    router.replace(`/profile/${address}`)
    return null
  }

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userWithBadges = gql.useUserBadgesById({ ownerAddress: addressOnUrl })
  const badges = userWithBadges.data?.user?.badges || []

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography textAlign="center" variant="subtitle2">
          {address === addressOnUrl
            ? 'This is your profile'
            : `This is the profile of ${addressOnUrl}`}
        </Typography>

        <Typography textAlign="justify" variant="body4">
          Here you can see the minted badges
        </Typography>
      </Stack>
      <Box>
        <Typography color={colors.green} textAlign="center" variant="title2">
          Badges that you own
        </Typography>
        {badges.map((bt) => {
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
              <LinkWithTranslation pathname={`/badge/${bt.badgeType.id}/${addressOnUrl}`}>
                Minted badge {bt.id}
              </LinkWithTranslation>

              <Typography>Status: {bt.status}</Typography>
              <Typography>
                Review DueDate: {dayjs.unix(bt.reviewDueDate).format('dddd, MMMM D, YYYY h:mm A')}
              </Typography>
              <Typography>BadgeType Id: {bt.badgeType.id}</Typography>
              <Typography>BadgeType Minted Amount: {bt.badgeType.badgesMintedAmount}</Typography>
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default withPageGenericSuspense(Profile)
