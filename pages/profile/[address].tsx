import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const Profile: NextPageWithLayout = () => {
  const { t } = useTranslation()

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
            ? t('profile.title')
            : t('profile.titleOf', { address: addressOnUrl })}
        </Typography>
      </Stack>
      <Box>
        <Typography color={colors.green} textAlign="center" variant="title2">
          {t('profile.badgesYouOwn')}
        </Typography>
        {/*TODO Add the real display UI */}
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
