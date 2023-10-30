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
import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload } from '@/types/utils'

export async function createAndUploadThirdPartyBadgeMetadata(
  badgeModelMetadata: BadgeModelMetadata,
  badgeModelId: string,
  additionalArgs: {
    imageBase64File: string
  },
) {
  const badgeMetadataIPFSUploaded = await ipfsUpload<BadgeMetadata<BackendFileUpload>>({
    attributes: {
      name: badgeModelMetadata?.name || '',
      description: badgeModelMetadata?.description || '',
      // TODO: This will point to the model not to the badge because is still not being created, we need to check if this url makes sense or not
      external_link: APP_URL + generateBadgePreviewUrl(badgeModelId),
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
