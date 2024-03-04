import { NextPageContext } from 'next'
import React, { ReactElement, useEffect } from 'react'

import CourtEvidenceDataView from '@/src/pagePartials/evidence/CourtEvidenceDataView'
import { useColorMode } from '@/src/providers/themeProvider'
import { SubgraphName, gqlQuery } from '@/src/subgraph/subgraph'
import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import { isTestnet } from '@/src/utils/network'
import { ChainsValues } from '@/types/chains'
import { Badge, BadgeByDisputeIdDocument, BadgeKlerosMetaData } from '@/types/generated/subgraph'

type InjectedParams = {
  // the ID of the dispute in the arbitrator contract;
  disputeID: string
  // the address of the arbitrator contract;
  arbitratorContractAddress: string
  // the ID of the chain (as defined by EIP-155) in which the arbitrator application is running;
  arbitratorChainID?: number
  // the URL of JSON RPC endpoint connecting to a node on the network. It MUST be pointing to a node from the same chain identified by arbitratorChainID.
  arbitratorJsonRpcUrl?: string
  // the address of the arbitrable contract;
  arbitrableContractAddress: string
  // the ID of the chain (as defined by EIP-155) in which the arbitrable application is running. If not provided by the Meta Evidence file, it SHOULD have the same value as arbitratorChainID.
  arbitrableChainID: number
  //the URL of JSON RPC endpoint connecting to a node on the network. It MUST be pointing to a node from the same chain identified by arbitrableChainID.
  arbitrableJsonRpcUrl: string
}

/**
 * Evidence Iframe used on Kleros Court to display a link to our preview page,
 * where the jurors would be able to see the data about the dispute
 **/
const EvidenceIframe = ({
  badge,
  ...parameters
}: {
  arbitrableChainID: ChainsValues
  arbitrableContractAddress: string
  arbitrableJsonRpcUrl: string
  arbitratorContractAddress: string
  disputeID: string
  badge: Badge
}) => {
  const { mode, setColorMode } = useColorMode()

  useEffect(() => {
    if (mode !== 'light') setColorMode('light')
  }, [mode, setColorMode])

  return (
    <>
      <CourtEvidenceDataView
        arbitrableChainID={parameters?.arbitrableChainID as ChainsValues}
        badge={badge}
        disputeID={parameters?.disputeID}
      />
    </>
  )
}

export const getServerSideProps = async (context: NextPageContext) => {
  const { query } = context
  const search = Object.keys(query)[0]
  const message = JSON.parse(search)
  const {
    arbitrableChainID,
    arbitrableContractAddress,
    arbitrableJsonRpcUrl,
    arbitratorContractAddress,
    disputeID,
  }: InjectedParams = message

  const subGraph = isTestnet
    ? devEndpoints[arbitrableChainID as ChainsValues][SubgraphName.TheBadge]
    : endpoints[arbitrableChainID as ChainsValues][SubgraphName.TheBadge]

  // Fetch data from external API
  const request = await gqlQuery(subGraph, {
    query: BadgeByDisputeIdDocument,
    variables: { disputeId: disputeID },
  })

  const klerosBadgeRequest = request.klerosBadgeRequests[0]

  const badge = (klerosBadgeRequest.badgeKlerosMetaData as BadgeKlerosMetaData).badge
  // const requester = klerosBadgeRequest.requester
  // const challenger = klerosBadgeRequest.challenger
  // const badgeModel = badge.badgeModel

  return {
    props: {
      arbitrableChainID,
      arbitrableContractAddress,
      arbitrableJsonRpcUrl,
      arbitratorContractAddress,
      disputeID,
      badge,
    },
  }
}

EvidenceIframe.getLayout = (page: ReactElement) => <>{page}</>
EvidenceIframe.skipWeb3Modal = true

export default EvidenceIframe
