import { EnrichTextVariables } from '@/src/utils/enrichTextWithValues'

export const KLEROS_LIST_TYPES_KEYS = [
  'address',
  'rich address',
  'number',
  'text',
  'boolean',
  'GTCR address',
  'image',
  'file',
  'link',
  'Twitter User',
  'long text',
] as const

export enum KLEROS_LIST_TYPES {
  ADDRESS = 'address',
  RICH_ADDRESS = 'rich address',
  NUMBER = 'number',
  TEXT = 'text',
  BOOLEAN = 'boolean',
  GTCR_ADDRESS = 'GTCR address',
  IMAGE = 'image',
  FILE = 'file',
  LINK = 'link',
  TWITTER_USER_ID = 'Twitter User',
  LONG_TEXT = 'long text',
}

export type MetadataColumn = {
  label: string
  description: string
  type: KLEROS_LIST_TYPES
  isIdentifier: boolean
}

export type ThirdPartyMetadataColumn = MetadataColumn & {
  replacementKey?: EnrichTextVariables
  isAutoFillable: boolean
}

export function isThirdPartyMetadataColumn(object: any): object is ThirdPartyMetadataColumn {
  if (object !== null && typeof object === 'object') {
    return 'isAutoFillable' in object && 'replacementKey' in object
  }
  return false
}
