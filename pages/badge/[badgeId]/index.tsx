import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types'
import { ReactElement } from 'react'
import * as React from 'react'

import { ssrGetContentFromIPFS } from '@/src/hooks/subgraph/utils'
import { CustomPageHead } from '@/src/pagePartials/index/CustomPageHead'
import { gqlQuery } from '@/src/subgraph/subgraph'
import devEndpoints from '@/src/subgraph/subgraph-endpoints-dev.json'
import endpoints from '@/src/subgraph/subgraph-endpoints.json'
import { isTestnet } from '@/src/utils/network'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeByIdDocument } from '@/types/generated/subgraph'
import { BackendFileResponse } from '@/types/utils'

const ViewBadge = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomPageHead {...props.metaTags} />
    </>
  )
}

export default ViewBadge
ViewBadge.getLayout = (page: ReactElement) => page

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ params, query, res }: GetServerSidePropsContext) {
  res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=59')

  const badgeId = params?.badgeId
  const contract = query.contract as string
  const { chainId, subgraphName } = parsePrefixedAddress(contract)

  const subGraph = isTestnet
    ? devEndpoints[chainId][subgraphName]
    : endpoints[chainId][subgraphName]

  // Fetch data from external API
  const request = await gqlQuery(subGraph, { query: BadgeByIdDocument, variables: { id: badgeId } })

  const badge = request.badge
  const badgeModel = badge?.badgeModel

  const metadataRequest = await Promise.all([
    ssrGetContentFromIPFS<BadgeMetadata<BackendFileResponse>>(badge?.uri),
    ssrGetContentFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModel?.uri),
  ])

  const badgeMetadata = metadataRequest[0] ? metadataRequest[0].result?.content : null
  const badgeModelMetadata = metadataRequest[1] ? metadataRequest[1].result?.content : null

  const metaTags = {
    title: `The Badge dApp - ${badgeModelMetadata?.name} Certificate`,
    description: `${badgeModelMetadata?.description} - Powered by TheBadge `,
    imageUrl: badgeMetadata?.image.s3Url,
  }

  // Pass data to the page via props
  return {
    props: {
      metaTags,
      badge: {
        ...badge,
        badgeModel: {
          ...badgeModel,
          badgeModelMetadata,
        },
        badgeMetadata,
      },
    },
  }
}
