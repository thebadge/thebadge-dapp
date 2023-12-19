import { DocumentNode } from 'graphql/language'
import { GraphQLClient } from 'graphql-request'
import nullthrows from 'nullthrows'

import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import { isTestnet } from '@/src/utils/network'
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
  const subGraph = isTestnet
    ? devEndpoints[chainId][subgraphName]
    : endpoints[chainId][subgraphName]
  const networkConfig = getSdkWithHooks(new GraphQLClient(subGraph))
  return nullthrows(networkConfig, `No sdk for chain id: ${chainId}`)
}

/**
 * Helpers that allows us to call the TheGraph to fetch needed data on SSR
 * @param gqlUrl
 * @param query
 * @param variables
 */
export async function gqlQuery(
  gqlUrl: string,
  { query, variables }: { variables?: Record<string, unknown>; query: DocumentNode },
) {
  function getGqlString(doc: DocumentNode) {
    return doc.loc && doc.loc.source.body
  }

  return fetch(gqlUrl, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getGqlString(query),
      variables: variables,
    }),
    method: 'POST',
    mode: 'cors',
  })
    .then((r) => r.json())
    .then((json) => json.data)
}
