import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload } from '@/types/utils'

type klerosListStructure = {
  name: string
  title: string
  description: string
  rulingOptions: {
    titles: string[]
    descriptions: string[]
  }
  category: string
  question: string
  fileURI: BackendFileUpload
  evidenceDisplayInterfaceURI: string
  metadata: {
    tcrTitle: string
    tcrDescription: string
    columns: MetadataColumn[]
    itemName: string
    itemNamePlural: string
    logoURI: BackendFileUpload
    requireRemovalEvidence: boolean
    isTCRofTCRs: boolean
    relTcrDisabled: boolean
    parentTCRAddress?: string
  }
  _v?: string
  evidenceDisplayInterfaceRequiredParams?: string[]
}

export function generateKlerosListMetaEvidence(
  badgeName: string,
  criteriaFileUri: BackendFileUpload,
  badgeTypeName: string,
  badgeTypeDescription: string,
  badgeMetadataColumns: MetadataColumn[],
  badgeTypeLogoUri: BackendFileUpload,
  requireRemovalEvidence = true,
  relTcrDisabled = true, // research about it
  category = 'Curated Lists',
  evidenceDisplayInterfaceURI = '/ipfs/QmQjJio59WkrQDzPC5kSP3EiGaqrWxjGfkvhmD2mWwm41M/index.html',
): { registration: klerosListStructure; clearing: klerosListStructure } {
  // TODO
  // check max items indexed = 3

  const itemNamePlural = `${badgeName}s`

  const registration: klerosListStructure = {
    name: badgeTypeName,
    title: `${badgeTypeName} evidences.`,
    description: `Add the evidence of the badge ${badgeName} to the list of evidences of ${badgeTypeName}.`,
    rulingOptions: {
      titles: ['Yes, Add It', "No, Don't Add It"],
      descriptions: [
        `Select this if you think the ${badgeName} complies with the required criteria and should be added.`,
        `Select this if you think the ${badgeName} does not comply with the required criteria and should not be added.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI: criteriaFileUri,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI: badgeTypeLogoUri,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  const clearing: klerosListStructure = {
    name: badgeTypeName,
    title: `Remove a ${badgeName} from ${itemNamePlural}`,
    description: `Someone requested to remove a ${badgeName} to ${itemNamePlural}`,
    rulingOptions: {
      titles: ['Yes, Remove It', "No, Don't Remove It"],
      descriptions: [
        `Select this if you think the ${badgeName} does not comply with the required criteria and should be removed.`,
        `Select this if you think the ${badgeName} complies with the required criteria and should not be removed.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI: criteriaFileUri,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI: badgeTypeLogoUri,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  return { registration, clearing }
}
