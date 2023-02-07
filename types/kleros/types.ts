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
