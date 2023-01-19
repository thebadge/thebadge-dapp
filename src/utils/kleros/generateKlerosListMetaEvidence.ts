import { MetadataColumn, klerosListStructure } from '@/src/utils/kleros/types'

export function generateKlerosListMetaEvidence(
  itemName: string,
  itemNamePlural: string,
  criteriaFileUri: string,
  listName: string,
  listDescription: string,
  listItemInfo: MetadataColumn[],
  listLogoUri: string,
  requireRemovalEvidence: boolean,
  relTcrDisabled: boolean, // research about it
  category = 'Curated Lists',
  evidenceDisplayInterfaceURI = '/ipfs/QmQjJio59WkrQDzPC5kSP3EiGaqrWxjGfkvhmD2mWwm41M/index.html',
): { registration: klerosListStructure; clearing: klerosListStructure } {
  // TODO
  // check max items indexed = 3
  // check filesUris are IPFS

  const registration: klerosListStructure = {
    name: listName,
    title: `Add a ${itemName} to ${itemNamePlural}`,
    description: `Someone requested to add a ${itemName} to ${itemNamePlural}`,
    rulingOptions: {
      titles: ['Yes, Add It', "No, Don't Add It"],
      descriptions: [
        `Select this if you think the ${itemName} complies with the required criteria and should be added.`,
        `Select this if you think the ${itemName} does not comply with the required criteria and should not be added.`,
      ],
    },
    category,
    question: `Does the ${itemName} comply with the required criteria?`,
    fileURI: criteriaFileUri,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: listName,
      tcrDescription: listDescription,
      columns: listItemInfo,
      itemName,
      itemNamePlural,
      logoURI: listLogoUri,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  const clearing: klerosListStructure = {
    name: listName,
    title: `Remove a ${itemName} from ${itemNamePlural}`,
    description: `Someone requested to remove a ${itemName} to ${itemNamePlural}`,
    rulingOptions: {
      titles: ['Yes, Remove It', "No, Don't Remove It"],
      descriptions: [
        `Select this if you think the ${itemName} does not comply with the required criteria and should be removed.`,
        `Select this if you think the ${itemName} complies with the required criteria and should not be removed.`,
      ],
    },
    category,
    question: `Does the ${itemName} comply with the required criteria?`,
    fileURI: criteriaFileUri,
    evidenceDisplayInterfaceURI,
    metadata: {
      tcrTitle: listName,
      tcrDescription: listDescription,
      columns: listItemInfo,
      itemName,
      itemNamePlural,
      logoURI: listLogoUri,
      requireRemovalEvidence,
      isTCRofTCRs: false,
      relTcrDisabled,
    },
  }

  return { registration, clearing }
}
