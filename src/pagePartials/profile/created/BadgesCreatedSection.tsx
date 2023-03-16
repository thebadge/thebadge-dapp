import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Countdown from 'react-countdown'
import { colors } from 'thebadge-ui-library'

import CreateNewBadge from '@/src/pagePartials/profile/created/CreateNewBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function BadgesCreatedSection() {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()

  if (!address) return null

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userCreatedBadges = gql.useUserCreatedBadges({ ownerAddress: address })
  const badges = userCreatedBadges.data?.user?.createdBadgeTypes || []

  return (
    <>
      <h2>BadgesCreatedSection</h2>
      <CreateNewBadge />

      <Stack gap={2} mt={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedOutlinedIcon />
          <Typography textAlign="center" variant="title4">
            {t('profile.badgesCreated')}
          </Typography>
        </Box>
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
              <Typography>Metdata URL: {bt.metadataURL}</Typography>
              <Typography>
                Review ends in <Countdown date={dayjs.unix(bt.validFor).toDate()} />
              </Typography>
              <Typography>BadgeType Id: {bt.id}</Typography>
              <Typography>BadgeType Minted Amount: {bt.badgesMintedAmount}</Typography>
            </Box>
          )
        })}
      </Stack>
    </>
  )
}
