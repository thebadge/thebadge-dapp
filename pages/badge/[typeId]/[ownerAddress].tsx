import { useSearchParams } from 'next/navigation'

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()

  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  const ownerAddress = searchParams.get('ownerAddress')
  const badgeId = `${ownerAddress}-${typeId}`
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badge = gql.useBadgeById({ id: badgeId })

  const badgeType = badge.data?.badge?.badgeType
  // TODO Add styles in the right way!
  return (
    <>
      <Box display="flex" flex={1} gap={4} justifyContent="space-evenly" my={4}>
        <Box display="flex">
          <BadgeTypeMetadata metadata={badgeType?.metadataURL} />
        </Box>
        <Stack gap={3} justifyContent="space-between">
          <Stack gap={2}>
            <Typography
              sx={{
                color: colors.green,
                fontSize: '25px !important',
                fontWeight: 'bold',
                textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
              }}
            >
              {/* TODO Replace with Badge real name */}
              Title Github Passport
            </Typography>
            <Typography
              sx={{ color: colors.green, fontSize: 10, fontWeight: 'bold' }}
              variant="caption"
            >
              BadgeID: {typeId}
            </Typography>
          </Stack>
          <Divider color={colors.white} />
          <Stack gap={2}>
            <Typography variant="body2">
              {t('badge.viewBadge.issueBy', { issuer: 'TheBadge' })}
            </Typography>
            <Typography variant="body2">
              {/* TODO Replace with Badge real description */}
              Minting your GitHub Passport is the first step to getting started with
              Proof-of-Talent. Claim the badge by connecting your GitHub account to Kleoverse and
              prove it is you who’s earning credentials. GitHub is where over 83 million developers
              shape the future of software, together. Show off your programming skills by building
              software and contributing to open-source projects. Claimable once.
            </Typography>
          </Stack>
          <Divider color={colors.white} />
          <Typography>
            {badgeType?.badgesMintedAmount}
            {t('badge.viewBadge.claims')}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography>{t('badge.viewBadge.checkHowElse')}</Typography>
            <ShareOutlinedIcon />
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default withPageGenericSuspense(ViewBadge)
