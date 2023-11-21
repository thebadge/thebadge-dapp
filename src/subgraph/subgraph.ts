import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import { ChainsValues } from '@/types/chains'
import { SdkWithHooks, getSdkWithHooks } from '@/types/generated/subgraph'

export type AllSDK = Record<ChainsValues, SdkWithHooks>

export enum SubgraphName {
  TheBadge = 'theBadge',
}

export function getSubgraphSdkByNetwork(
  chainId: ChainsValues,
  subgraphName: SubgraphName,
): ReturnType<typeof getSdkWithHooks> {
  const subGraph = devEndpoints[chainId][subgraphName]
  const networkConfig = getSdkWithHooks(new GraphQLClient(subGraph))
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
