import { JsonRpcProvider } from '@ethersproject/providers'
import { constants } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'

import { APP_URL, IS_DEVELOP } from '@/src/constants/common'
import ipfsUpload from '@/src/utils/ipfsUpload'
import {
  KlerosListStructure,
  generateKlerosListMetaEvidence,
} from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { Kleros__factory } from '@/types/generated/typechain'
import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload, Severity } from '@/types/utils'

export async function createAndUploadBadgeModelMetadata(
  badgeModelName: string,
  badgeModelDescription: string,
  badgeModelLogoUri: BackendFileUpload,
) {
  const badgeModelMetadataIPFSUploaded = await ipfsUpload<BadgeModelMetadata<BackendFileUpload>>({
    attributes: {
      name: badgeModelName,
      description: badgeModelDescription,
      image: badgeModelLogoUri,
      external_link: `${APP_URL}/explore`,
    },
    filePaths: ['image'],
  })

  return `ipfs://${badgeModelMetadataIPFSUploaded.result?.ipfsHash}`
}

/**
 * Clearing files contain information about the removal of items from a TCR list.
 * Registration files, on the other hand, contain information about the
 * addition of items to a TCR list. In out business logic, both files has the
 * same criteria.
 * @param badgeModelName
 * @param badgeModelDescription
 * @param badgeModelLogoUri
 * @param badgeModelCriteriaFileUri
 * @param badgeModelKlerosColumns
 */
export async function createAndUploadClearingAndRegistrationFilesForKleros(
  badgeModelName: string,
  badgeModelDescription: string,
  badgeModelLogoUri: BackendFileUpload,
  badgeModelCriteriaFileUri: BackendFileUpload,
  badgeModelKlerosColumns: MetadataColumn[],
) {
  const { clearing, registration } = generateKlerosListMetaEvidence(
    badgeModelName,
    badgeModelCriteriaFileUri,
    badgeModelName,
    badgeModelDescription,
    badgeModelKlerosColumns,
    badgeModelLogoUri,
  )

  const registrationIPFSUploaded = await ipfsUpload<KlerosListStructure>({
    attributes: registration,
    filePaths: ['fileURI', 'metadata.logoURI'],
  })

  const clearingIPFSUploaded = await ipfsUpload<KlerosListStructure>({
    attributes: clearing,
    filePaths: ['fileURI', 'metadata.logoURI'],
  })

  return {
    clearingIPFSHash: `ipfs://${clearingIPFSUploaded.result?.ipfsHash}`,
    registrationIPFSHash: `ipfs://${registrationIPFSUploaded.result?.ipfsHash}`,
  }
}

export async function encodeKlerosControllerData(
  creatorAddress: string,
  klerosContractAddress: string,
  readOnlyAppProvider: JsonRpcProvider,
  severity: Severity,
  courtId = 0,
  registrationIPFSHash: string,
  clearingIPFSHash: string,
  challengePeriodDuration: number,
) {
  if (courtId !== 0) throw `Just the General court (courtId=0) is supported right now` // TODO: fixed for now

  const kleros = Kleros__factory.connect(klerosContractAddress, readOnlyAppProvider)
  const numberOfJurors = severity
  const klerosCourtInfo = await kleros.courts(courtId)
  const baseDeposit = klerosCourtInfo.feeForJuror.mul(numberOfJurors)

  // jurors * fee per juror + rigorousness
  const submissionDeposit = baseDeposit
    .add(klerosCourtInfo.feeForJuror.mul(numberOfJurors))
    .toString()
  // The base deposit to remove an item.
  const removalDeposit = baseDeposit.add(klerosCourtInfo.feeForJuror.mul(numberOfJurors)).toString()
  // The base deposit to challenge a submission.
  const challengeSubmissionRequestDeposit = baseDeposit.div(2).toString()
  // The base deposit to challenge a removal request
  const challengeRemovalRequestDeposit = baseDeposit.div(4).toString()

  // Received challengePeriodDuration is considered in Dev = hours and in Prod = Days
  const challengeDurationInSeconds = challengePeriodDuration * (IS_DEVELOP ? 1 : 24) * 60 * 60

  const klerosControllerDataEncoded = defaultAbiCoder.encode(
    [
      `tuple(
          address,
          address,
          uint256,
          uint256,
          string,
          string,
          uint256,
          uint256[4],
          uint256[3]
        )`,
    ],
    [
      [
        creatorAddress, // governor
        constants.AddressZero, // admin
        courtId,
        numberOfJurors,
        registrationIPFSHash,
        clearingIPFSHash,
        challengeDurationInSeconds,
        [
          submissionDeposit,
          removalDeposit,
          challengeSubmissionRequestDeposit,
          challengeRemovalRequestDeposit,
        ], // baseDeposits:
        [100, 100, 100], // stakeMultipliers:
      ],
    ],
  )

  return klerosControllerDataEncoded
}
