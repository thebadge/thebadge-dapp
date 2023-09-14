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

export function saveChallengedBadgeId(badgeId: string, userAddress: string | null) {
  const existingSessionValue = getChallengedBadgesId(userAddress)
  const key = `${userAddress}:challengedBadges`

  sessionStorage.setItem(key, JSON.stringify([badgeId, ...existingSessionValue]))
}

export function updateChallengedBadgesId(badgesId: string[], userAddress: string | null) {
  const key = `${userAddress}:challengedBadges`
  sessionStorage.setItem(key, JSON.stringify(badgesId))
}

export function getChallengedBadgesId(userAddress: string | null): string[] {
  const key = `${userAddress}:challengedBadges`
  return JSON.parse(sessionStorage.getItem(key) ?? '[]')
}

export function removeChallengedBadgeId(badgeIdToRemove: string, userAddress: string | null) {
  const existingSessionValue = getChallengedBadgesId(userAddress)
  const key = `${userAddress}:challengedBadges`

  sessionStorage.setItem(
    key,
    JSON.stringify(existingSessionValue.filter((id) => id !== badgeIdToRemove)),
  )
}
