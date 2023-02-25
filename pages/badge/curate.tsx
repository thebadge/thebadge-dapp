import { Typography } from '@mui/material'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BadgeCuration } from '@/src/pagePartials/badge/curate/BadgeCuration'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const now = Math.floor(Date.now() / 1000)
const ExploreBadges: NextPageWithLayout = () => {
  const { appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgesInReview = gql.useBadgesInReview({ date: now })

  return (
    <>
      <Typography variant="h3">Badges in review</Typography>

      <div>
        {badgesInReview.data?.badges.map((badge) => {
          return (
            <SafeSuspense key={badge.id}>
              <BadgeCuration badge={badge} />
            </SafeSuspense>
          )
        })}
      </div>
    </>
  )
}

export default withPageGenericSuspense(ExploreBadges)
