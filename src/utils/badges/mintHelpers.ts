import { APP_URL } from '@/src/constants/common'
import { convertHashToValidIPFSKlerosHash } from '@/src/utils/fileUtils'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { generateBadgePreviewUrl, generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import {
  BadgeEvidenceMetadata,
  BadgeMetadata,
  BadgeModelMetadata,
} from '@/types/badges/BadgeMetadata'
import { ChainsValues } from '@/types/chains'
import { MetadataColumn, ThirdPartyMetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload } from '@/types/utils'

type ThirdPartyEvidence = {
  estimatedBadgeId: string
  theBadgeContractAddress: string
  appChainId: ChainsValues
  badgeModelMetadata: BadgeModelMetadata
  additionalArgs: {
    imageBase64File: string
  }
}

export async function createAndUploadThirdPartyBadgeMetadata({
  additionalArgs,
  appChainId,
  badgeModelMetadata,
  estimatedBadgeId,
  theBadgeContractAddress,
}: ThirdPartyEvidence) {
  const badgeMetadataIPFSUploaded = await ipfsUpload<BadgeMetadata<BackendFileUpload>>({
    attributes: {
      name: badgeModelMetadata?.name || '',
      description: badgeModelMetadata?.description || '',
      external_link:
        APP_URL +
        generateBadgePreviewUrl(estimatedBadgeId, {
          theBadgeContractAddress: theBadgeContractAddress,
          connectedChainId: appChainId,
        }),
      attributes: [
        {
          trait_type: 'CreationDate',
          value: Date.now(),
          display_type: 'date',
        },
      ],
      image: { mimeType: 'image/png', base64File: additionalArgs.imageBase64File },
    },
    filePaths: ['image'],
  })

  return `ipfs://${badgeMetadataIPFSUploaded.result?.ipfsHash}`
}

export async function createAndUploadBadgeMetadata(
  badgeModelMetadata: BadgeModelMetadata,
  minterAddress: string,
  additionalArgs: {
    imageBase64File: string
  },
) {
  const badgeMetadataIPFSUploaded = await ipfsUpload<BadgeMetadata<BackendFileUpload>>({
    attributes: {
      name: badgeModelMetadata?.name || '',
      description: badgeModelMetadata?.description || '',
      external_link: APP_URL + generateProfileUrl({ address: minterAddress }),
      attributes: [],
      image: { mimeType: 'image/png', base64File: additionalArgs.imageBase64File },
    },
    filePaths: ['image'],
  })

  return `ipfs://${badgeMetadataIPFSUploaded.result?.ipfsHash}`
}

/**
 * Store the evidence provided by the user, with the array of "columns" to be
 * able to replicate the form if its needed, and also to have the tack of
 * values <-> required evidence
 * @param columns
 * @param values
 */
export async function createAndUploadBadgeEvidence(
  columns: MetadataColumn[],
  values: Record<string, any>,
) {
  const filePaths = getFilePathsFromValues(values)
  const evidenceIPFSUploaded = await ipfsUpload<BadgeEvidenceMetadata>({
    attributes: {
      columns,
      values,
      submittedAt: Date.now(),
    },
    filePaths: filePaths,
  })

  return convertHashToValidIPFSKlerosHash(evidenceIPFSUploaded.result?.ipfsHash)
}

/**
 * Store the required data and the values that the creator has complete at mint time.
 * This values are used later on to render the TP Badge
 * @param columns
 * @param values
 */
export async function createAndUploadThirdPartyRequiredData(
  columns: ThirdPartyMetadataColumn[],
  values: Record<string, any>,
) {
  const filePaths = getFilePathsFromValues(values)
  const evidenceIPFSUploaded = await ipfsUpload<BadgeEvidenceMetadata>({
    attributes: {
      columns,
      values,
      submittedAt: Date.now(),
    },
    filePaths: filePaths,
  })

  return evidenceIPFSUploaded.result?.ipfsHash || 'no-hash'
}

/**
 * Method that take the form field evidence, and convert it to the needed format to store it
 * @param data
 * @param klerosBadgeMetadata
 */
export function createKlerosValuesObject(
  data: Record<string, unknown>,
  klerosBadgeMetadata?: KlerosListStructure | null,
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  if (!klerosBadgeMetadata) return values
  // If we change this "shape" key values, we need to update the klerosSchemaFactory on src/components/form/helpers/validators.ts
  klerosBadgeMetadata.metadata.columns.forEach((column, i) => {
    values[`${column.label}`] = data[`${i}`]
  })
  return values
}

/**
 * Method that take the form field requiredData, and convert it to the needed format to store it
 * @param data
 * @param columns
 */
export function createThirdPartyValuesObject(
  data: Record<string, unknown>,
  columns?: ThirdPartyMetadataColumn[],
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  if (!columns) return values
  // If we change this "shape" key values, we need to update the klerosSchemaFactory on src/components/form/helpers/validators.ts
  columns.forEach((column, i) => {
    values[`${column.replacementKey}`] = data[`${i}`]
  })
  return values
}

/**
 * Method that takes the stored values and make it usable by the components
 * @param data
 * @param columns
 */
export function reCreateThirdPartyValuesObject(
  data: Record<string, unknown>,
  columns?: ThirdPartyMetadataColumn[],
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  if (!columns) return values
  // If we change this "shape" key values, we need to update the klerosSchemaFactory on src/components/form/helpers/validators.ts
  columns.forEach((column) => {
    // Right now the keys are the same, it will keep this function to be able to change it later if we need
    values[`${column.replacementKey}`] = data[`${column.replacementKey}`]
  })
  return values
}

function getFilePathsFromValues(values: Record<string, any>) {
  if (!values) return []
  const filePaths: string[] = []
  Object.keys(values).forEach((key) => {
    if (values[key].base64File) {
      filePaths.push(`values.${key}`)
    }
  })

  return filePaths
}
