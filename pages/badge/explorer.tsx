import Link from 'next/link'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'

import DefaultLayout from '@/src/components/layout/DefaultLayout'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadges: NextPageWithLayout = () => {
  const { appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeTypes = gql.useBadgeTypes()

  return (
    <>
      <Typography variant="h3">Badge types</Typography>

      <div>
        {badgeTypes.data?.badgeTypes.map((bt) => {
          return (
            <div key={bt.id}>
              <BadgeTypeMetadata metadata={bt.metadataURL} />
              <div>mintCost: {formatUnits(bt.mintCost, 18)} + Kleros deposit</div>
              <div>ValidFor: {bt.validFor} </div>
              <div>paused: {bt.paused ? 'Yes' : 'No'}</div>
              <div>Controller: {bt.controllerName}</div>
              {/* TODO ADD Creator/Emitter Metada*/}
              {/*<div>Metadata: {bt.emitter.metadata}</div>*/}
              {/* This is broken because the metadata is not linked on IPFS. */}
              {/* <CreatorDetails metadata={bt.emitter.metadata} /> */}
              <Link href={`/badge/mint/${bt.id}`}>Mint</Link>

              <br />
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
