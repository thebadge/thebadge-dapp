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
  Template = 'Template',
}

export enum DiplomaNFTAttributesType {
  Template = 'Template',
  CourseName = 'CourseName',
  AchievementDescription = 'AchievementDescription',
  AchievementDate = 'AchievementDate',
  FooterConfigs = 'FooterConfigs',
  SignerConfigs = 'SignerConfigs',
  IssuerConfigs = 'IssuerConfigs',
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

export type DiplomaSignatureConfig<T = IPFSHash | BackendFileResponse | BackendFileUpload> = {
  signatureEnabled: boolean
  signatureImage?: T
  signerTitle?: string
  signerSubline?: string
}

export type DiplomaIssuerConfig<T = IPFSHash | BackendFileResponse | BackendFileUpload> = {
  customIssuerEnabled: boolean
  issuerAvatar?: T
  issuedByLabel?: string
  issuerTitle?: string
  issuerDescription?: string
}

export type DiplomaFooterConfig = {
  footerEnabled: boolean
  footerText?: string
}
