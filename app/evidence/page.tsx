import React from 'react'

import { APP_URL } from '@/src/constants/common'
import { ssrGetContentFromIPFS } from '@/src/hooks/subgraph/utils'
import BadgeEvidenceSwiper from '@/src/pagePartials/badge/curate/viewEvidence/BadgeEvidenceSwiper'
import ViewDetailsButton from '@/src/pagePartials/evidence/addons/ViewDetailsButton'
import ThemeProvider from '@/src/providers/themeProvider'
import { SubgraphName, gqlQuery } from '@/src/subgraph/subgraph'
import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
import { BadgeEvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { ChainsValues } from '@/types/chains'
import {
  Badge,
  BadgeByDisputeIdDocument,
  BadgeKlerosMetaData,
  KlerosRequestType,
} from '@/types/generated/subgraph'

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

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = Object.keys(searchParams)[0]
  if (search === undefined) return
  const message = JSON.parse(search)
  const { arbitrableChainID, disputeID }: InjectedParams = message

  const subGraph = isTestnet
    ? devEndpoints[arbitrableChainID as ChainsValues][SubgraphName.TheBadge]
    : endpoints[arbitrableChainID as ChainsValues][SubgraphName.TheBadge]

  // Fetch data from external API
  const request = await gqlQuery(subGraph, {
    query: BadgeByDisputeIdDocument,
    variables: { disputeId: disputeID },
  })

  const klerosBadgeRequest = request.klerosBadgeRequests[0]

  const badgeKlerosMetaData = klerosBadgeRequest.badgeKlerosMetaData as BadgeKlerosMetaData
  const badge = badgeKlerosMetaData.badge as Badge

  const registrationRequest = badgeKlerosMetaData?.requests?.find(
    (r) => r.type === KlerosRequestType.Registration,
  )
  const registrationEvidence = registrationRequest?.evidences?.find(
    (e) => e.sender === badge?.account.id,
  )

  const res = await ssrGetContentFromIPFS<BadgeEvidenceMetadata, { s3Url: string }>(
    registrationEvidence?.uri,
  )

  const requestBadgeEvidence = res ? res.result?.content : undefined

  const linkToSubmissionView =
    APP_URL +
    generateBadgePreviewUrl(badge.id, {
      theBadgeContractAddress: badge.contractAddress,
      connectedChainId: arbitrableChainID as ChainsValues,
    })

  return (
    <>
      <ThemeProvider>
        <BadgeEvidenceSwiper
          badgeEvidence={requestBadgeEvidence}
          networkId={arbitrableChainID as ChainsValues}
        />
        <ViewDetailsButton linkToSubmissionView={linkToSubmissionView} />
      </ThemeProvider>
    </>
  )
}
