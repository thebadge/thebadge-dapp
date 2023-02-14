import { Box, Typography } from '@mui/material'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const MintBadge: NextPageWithLayout = () => {
  const { appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeTypes = gql.useBadgeTypes()

  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can choose the badge type that you want to mint, and complete the process
      </Typography>

      <Box display="flex" flexDirection="column">
        {badgeTypes.data?.badgeTypes.map((bt) => {
          return (
            <div key={bt.id}>
              <LinkWithTranslation pathname={`/badge/mint/${bt.id}`}>
                + Mint badge {bt.id}
              </LinkWithTranslation>
            </div>
          )
        })}
      </Box>
    </>
  )
}

export default withPageGenericSuspense(MintBadge)
