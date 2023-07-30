import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileResponse, BackendFileUpload, IPFSHash, NFTAttribute } from '@/types/utils'

export type BadgeEvidenceMetadata = {
  columns: MetadataColumn[]
  values: Record<string, any>
}

export type BadgeModelMetadata<T = IPFSHash | BackendFileResponse | BackendFileUpload> = {
  name: string
  description: string
  image: T
  external_link: string
  attributes?: NFTAttribute[]
}

// This type follows the https://docs.opensea.io/docs/metadata-standards
export type BadgeMetadata<T = IPFSHash | BackendFileResponse | BackendFileUpload> = {
  name: string
  description: string
  external_link: string
  image: T
  attributes?: NFTAttribute[]
}

export enum BadgeNFTAttributesType {
  Background = 'Background',
  TextContrast = 'TextContrast',
}

export type EvidenceMetadata = {
  title: string
  description: string
  // Attached file evidence
  fileURI?: string
  fileTypeExtension?: string
  // File Mimetype
  type?: string
}
