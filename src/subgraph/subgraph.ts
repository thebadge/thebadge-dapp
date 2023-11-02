import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import isDev from '@/src/utils/isDev'
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
  const subGraph = isDev ? devEndpoints[chainId][subgraphName] : endpoints[chainId][subgraphName]
  const networkConfig = getSdkWithHooks(new GraphQLClient(subGraph))
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}
