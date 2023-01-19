import { textInputs } from 'polished'

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

export type klerosListStructure = {
  name: string
  title: string
  description: string
  rulingOptions: {
    titles: string[]
    descriptions: string[]
  }
  category: string
  question: string
  fileURI: string
  evidenceDisplayInterfaceURI: string
  metadata: {
    tcrTitle: string
    tcrDescription: string
    columns: MetadataColumn[]
    itemName: string
    itemNamePlural: string
    logoURI: string
    requireRemovalEvidence: boolean
    isTCRofTCRs: boolean
    relTcrDisabled: boolean
    parentTCRAddress?: string
  }
  _v?: string
  evidenceDisplayInterfaceRequiredParams?: string[]
}
