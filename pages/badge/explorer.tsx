import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import CreatorDetails from '@/src/pagePartials/creator/CreatorDetails'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

const ExploreBadges: NextPageWithLayout = () => {
  const { appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeTypes = gql.useBadgeTypes()

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Badge types
      </Typography>

      <div>
        {badgeTypes.data?.badgeTypes.map((bt) => {
          return (
            <div key={bt.id}>
              <div>{bt.controllerName}</div>
              <div>{bt.emitter.metadata}</div>
              {/* This is broken because the metadata is not linked on IPFS. */}
              {/* <CreatorDetails metadata={bt.emitter.metadata} /> */}
              <div>{bt.mintCost}</div>
              <div>{bt.paused}</div>
              <div>{bt.validFor}</div>
              <BadgeTypeMetadata metadata={bt.metadataURL} />
            </div>
          )
        })}
      </div>
    </>
  )
}

ExploreBadges.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default ExploreBadges
