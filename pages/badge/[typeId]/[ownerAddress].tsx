import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import challengedLogo from '@/src/components/assets/challenged.webp'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useChallengeProvider } from '@/src/providers/challengeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const { challenge } = useChallengeProvider()

  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  const ownerAddress = searchParams.get('ownerAddress')

  if (!typeId || !ownerAddress) {
    throw `No typeId/ownerAddress provided us URL query param`
  }

  const badgeId = `${ownerAddress}-${typeId}`
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeResponse = gql.useBadgeById({ id: badgeId })

  const badge = badgeResponse.data?.badge
  const badgeType = badge?.badgeType
  // TODO Add styles in the right way!
  return (
    <Box sx={{ position: 'relative' }}>
      {/** Temporary logic - Update to "Challenged" status **/}
      {badge?.status === 'Approved' && (
        <Box sx={{ position: 'absolute', right: 0, top: -10, width: '150px', cursor: 'pointer' }}>
          <Image alt="Challenged badge" src={challengedLogo} />
        </Box>
      )}
      <Stack maxWidth={900} mx={'auto'}>
        <Box display="flex" flex={1} gap={4} justifyContent="space-evenly" my={4}>
          <Box display="flex">
            <BadgeTypeMetadata metadata={badgeType?.metadataURL} />
          </Box>
          <Stack gap={3} justifyContent="space-between">
            <Stack gap={2}>
              <Typography
                sx={{
                  color: colors.green,
                  textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
                }}
                variant="dAppTitle3"
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
              <Typography variant="dAppBody1">
                {/* TODO Replace with Badge real description */}
                Minting your GitHub Passport is the first step to getting started with
                Proof-of-Talent. Claim the badge by connecting your GitHub account to Kleoverse and
                prove it is you who’s earning credentials. GitHub is where over 83 million
                developers shape the future of software, together. Show off your programming skills
                by building software and contributing to open-source projects. Claimable once.
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
        <Box display="flex">
          <Button
            color="green"
            onClick={() => challenge(typeId, ownerAddress)}
            size="large"
            sx={{ borderRadius: 3 }}
            variant="contained"
          >
            Challenge
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default withPageGenericSuspense(ViewBadge)
