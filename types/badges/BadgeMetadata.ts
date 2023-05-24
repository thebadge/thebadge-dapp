import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileResponse, IPFSHash, NFTAttribute } from '@/types/utils'

export type BadgeEvidenceMetadata = {
  columns: MetadataColumn[]
  values: Record<string, any>
}

export type BadgeModelMetadata<T = IPFSHash | BackendFileResponse> = {
  name: string
  description: string
  image: T
  external_link: string
}

// This type follows the https://docs.opensea.io/docs/metadata-standards
export type BadgeMetadata<T = IPFSHash | BackendFileResponse> = {
  name: string
  description: string
  external_link: string
  image: T
  attributes: NFTAttribute[]
}
