export const KLEROS_LIST_TYPES_KEYS = [
  'ADDRESS',
  'RICH_ADDRESS',
  'NUMBER',
  'TEXT',
  'BOOLEAN',
  'GTCR_ADDRESS',
  'IMAGE',
  'FILE',
  'LINK',
  'TWITTER_USER_ID',
  'LONG_TEXT',
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
