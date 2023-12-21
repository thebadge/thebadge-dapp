import { Metadata } from 'next'

import { ssrGetContentFromIPFS } from '@/src/hooks/subgraph/utils'
import RedirectToViewPage from '@/src/pagePartials/badge/preview/RedirectToViewPage'
import { gqlQuery } from '@/src/subgraph/subgraph'
import { isTestnet } from '@/src/utils/network'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeByIdDocument } from '@/types/generated/subgraph'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  params: { badgeId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page() {
  return <RedirectToViewPage />
}

/**
 * Read more on https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const devEndpoints = require('@/src/subgraph/subgraph-endpoints-dev.json')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const endpoints = require('@/src/subgraph/subgraph-endpoints.json')

  const badgeId = params?.badgeId
  const contract = searchParams?.contract as string
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

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
  const title = `The Badge dApp - ${badgeModelMetadata?.name} Certificate`
  const description = `${badgeModelMetadata?.description} - Powered by TheBadge `
  const badgeImageUrl = badgeMetadata?.image.s3Url || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: badgeImageUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: {
        url: badgeImageUrl,
        alt: 'Visual model of the owned badge',
        secureUrl: badgeImageUrl,
      },
    },
  }
}
