import { DYNAMIC_SCRIPT_IPFS_HASH } from '@/src/constants/common'
import { generateEvidenceUrl } from '@/src/utils/navigation/generateUrl'
import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileResponse, BackendFileUpload } from '@/types/utils'

// https://github.com/ethereum/EIPs/issues/1497
export type KlerosListStructure = {
  name: string
  title: string
  description: string
  rulingOptions: {
    titles: string[]
    descriptions: string[]
  }
  category: string
  question: string
  fileURI?: BackendFileUpload | BackendFileResponse
  fileHash?: string
  fileTypeExtension: string
  evidenceDisplayInterfaceURI: string
  dynamicScriptURI?: string
  dynamicScriptRequiredParams?: string[]
  metadata: {
    tcrTitle: string
    tcrDescription: string
    columns: MetadataColumn[]
    itemName: string
    itemNamePlural: string
    logoURI: BackendFileUpload | BackendFileResponse
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
  criteriaFile: BackendFileUpload,
  badgeTypeName: string,
  badgeTypeDescription: string,
  badgeMetadataColumns: MetadataColumn[],
  logoURI: BackendFileUpload,
  requireRemovalEvidence = true,
  relTcrDisabled = true, // research about it
  category = 'Badge Dispute',
): { registration: KlerosListStructure; clearing: KlerosListStructure } {
  const itemNamePlural = `${badgeName}s`

  const registration: KlerosListStructure = {
    name: badgeTypeName,
    title: `${badgeTypeName} evidences is valid according to the ruling file?`,
    description: `The evidence provided on the badge ${badgeName} need to be what the ${badgeTypeName} ruling file ask for.`,
    rulingOptions: {
      titles: ['Yes, Add It', "No, Don't Add It"],
      descriptions: [
        `Select this if you think the ${badgeName} complies with the required criteria and should be added.`,
        `Select this if you think the ${badgeName} does not comply with the required criteria and should not be added.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI: criteriaFile,
    fileTypeExtension: 'pdf',
    evidenceDisplayInterfaceURI: window.location.origin + generateEvidenceUrl(),
    dynamicScriptURI: `ipfs/${DYNAMIC_SCRIPT_IPFS_HASH}`,
    dynamicScriptRequiredParams: ['disputeID', 'arbitrableChainID', 'arbitrableContractAddress'],
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  const clearing: KlerosListStructure = {
    name: badgeTypeName,
    title: `Remove a ${badgeName} from ${itemNamePlural}`,
    description: `Someone requested to remove a ${badgeName} from the list of ${itemNamePlural}, because it doesnt complain with the required criteria on the ruling file`,
    rulingOptions: {
      titles: ['Yes, Remove It', "No, Don't Remove It"],
      descriptions: [
        `Select this if you think the ${badgeName} does not comply with the required criteria and should be removed.`,
        `Select this if you think the ${badgeName} complies with the required criteria and should not be removed.`,
      ],
    },
    category,
    question: `Does the ${badgeName} comply with the required criteria?`,
    fileURI: criteriaFile,
    fileTypeExtension: 'pdf',
    evidenceDisplayInterfaceURI: window.location.origin + generateEvidenceUrl(),
    dynamicScriptURI: `ipfs/${DYNAMIC_SCRIPT_IPFS_HASH}`,
    dynamicScriptRequiredParams: ['disputeID', 'arbitrableChainID', 'arbitrableContractAddress'],
    metadata: {
      tcrTitle: badgeTypeName,
      tcrDescription: badgeTypeDescription,
      columns: badgeMetadataColumns,
      itemName: badgeName,
      itemNamePlural,
      logoURI,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  return { registration, clearing }
}
