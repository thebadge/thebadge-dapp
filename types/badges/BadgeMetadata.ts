import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileResponse, BackendFileUpload, IPFSHash, NFTAttribute } from '@/types/utils'

export type BadgeEvidenceMetadata = {
  columns: MetadataColumn[]
  values: Record<string, any>
  submittedAt: number
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

export enum DiplomaNFTAttributesType {
  CourseName = 'CourseName',
  AchievementDescription = 'AchievementDescription',
  AchievementDate = 'AchievementDate',
  SignatureEnabled = 'SignatureEnabled',
  SignerTitle = 'SignerTitle',
  SignerSubline = 'SignerSubline',
  SignatureImage = 'SignatureImage',
  FooterEnabled = 'FooterEnabled',
  FooterText = 'FooterText',
  CustomIssuerEnabled = 'CustomIssuerEnabled',
  IssuedByLabel = 'IssuedByLabel',
  IssuerAvatar = 'IssuerAvatar',
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
