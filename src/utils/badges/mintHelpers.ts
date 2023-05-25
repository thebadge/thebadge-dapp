import { APP_URL } from '@/src/constants/common'
import ipfsUpload from '@/src/utils/ipfsUpload'
import {
  BadgeEvidenceMetadata,
  BadgeMetadata,
  BadgeModelMetadata,
} from '@/types/badges/BadgeMetadata'
import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload } from '@/types/utils'

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
      external_link: `${APP_URL}/profile/${minterAddress}`,
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
    },
    filePaths: filePaths,
  })
  console.log({
    attributes: {
      columns,
      values,
    },
    filePaths: filePaths,
  })

  console.log(evidenceIPFSUploaded.result?.ipfsHash)
  return `ipfs://${evidenceIPFSUploaded.result?.ipfsHash}`
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
