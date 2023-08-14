import { convertHashToValidIPFSKlerosHash } from '@/src/utils/fileUtils'
import ipfsUpload from '@/src/utils/ipfsUpload'

export async function createAndUploadChallengeEvidence(
  challengeTitle: string,
  challengeDescription: string,
  attachment: { mimeType: string; base64File: string },
) {
  const evidenceIPFSUploaded = await ipfsUpload({
    attributes: {
      title: challengeTitle,
      description: challengeDescription,
      ...(attachment
        ? {
            fileURI: attachment,
            fileTypeExtension: attachment?.mimeType,
            type: attachment?.mimeType.split('/')[1],
          }
        : {}),
    },
    filePaths: attachment ? ['fileURI'] : [],
  })

  return convertHashToValidIPFSKlerosHash(evidenceIPFSUploaded.result?.ipfsHash)
}
