import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumberish } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { z } from 'zod'

import { DeltaPDFSchema } from '@/src/components/form/helpers/customSchemas'
import { APP_URL } from '@/src/constants/common'
import { BadgeModelCommunityCriteriaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import { convertHashToValidIPFSKlerosHash } from '@/src/utils/fileUtils'
import ipfsUpload from '@/src/utils/ipfsUpload'
import {
  KlerosListStructure,
  generateKlerosListMetaEvidence,
} from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { isTestnet } from '@/src/utils/network'
import { BadgeModelMetadata, BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { Kleros__factory } from '@/types/generated/typechain'
import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileUpload } from '@/types/utils'

export async function createAndUploadBadgeModelMetadata(
  badgeModelName: string,
  badgeModelDescription: string,
  badgeModelLogoUri: BackendFileUpload,
  backgroundType: string,
  textContrast: string,
) {
  const badgeModelMetadataIPFSUploaded = await ipfsUpload<BadgeModelMetadata<BackendFileUpload>>({
    attributes: {
      name: badgeModelName,
      description: badgeModelDescription,
      image: badgeModelLogoUri,
      external_link: `${APP_URL}/explore`,
      attributes: [
        {
          trait_type: BadgeNFTAttributesType.Background,
          value: backgroundType,
        },
        {
          trait_type: BadgeNFTAttributesType.TextContrast,
          value: textContrast,
        },
      ],
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
 * @param badgeModelCriteria
 * @param badgeModelKlerosColumns
 */
export async function createAndUploadClearingAndRegistrationFilesForKleros(
  badgeModelName: string,
  badgeModelDescription: string,
  badgeModelLogoUri: BackendFileUpload,
  badgeModelCriteria: BadgeModelCommunityCriteriaType,
  badgeModelKlerosColumns: MetadataColumn[],
) {
  let badgeModelCriteriaFile: BackendFileUpload = {
    mimeType: 'application/pdf',
    base64File: '',
  }
  // If the user upload the file, we already have the needed format
  if (badgeModelCriteria.criteriaFileUri) {
    badgeModelCriteriaFile = badgeModelCriteria.criteriaFileUri
  }
  // If the user has made the criteria on our own text area, we need to convert it to PDF on Base64
  if (badgeModelCriteria.criteriaDeltaText) {
    badgeModelCriteriaFile.base64File = await transformDeltaToPDF(
      badgeModelCriteria.criteriaDeltaText,
    )
  }

  const { clearing, registration } = generateKlerosListMetaEvidence(
    badgeModelName,
    badgeModelCriteriaFile,
    badgeModelName,
    badgeModelDescription,
    badgeModelKlerosColumns,
    badgeModelLogoUri,
  )

  const registrationIPFSUploadedPromise = ipfsUpload<KlerosListStructure>({
    attributes: registration,
    filePaths: ['fileURI', 'metadata.logoURI'],
    needKlerosPath: true,
  })

  const clearingIPFSUploadedPromise = ipfsUpload<KlerosListStructure>({
    attributes: clearing,
    filePaths: ['fileURI', 'metadata.logoURI'],
    needKlerosPath: true,
  })

  const [registrationIPFSUploaded, clearingIPFSUploaded] = await Promise.all([
    registrationIPFSUploadedPromise,
    clearingIPFSUploadedPromise,
  ])

  return {
    clearingIPFSHash: convertHashToValidIPFSKlerosHash(clearingIPFSUploaded.result?.ipfsHash),
    registrationIPFSHash: convertHashToValidIPFSKlerosHash(
      registrationIPFSUploaded.result?.ipfsHash,
    ),
  }
}

export async function encodeKlerosBadgeModelControllerData(
  creatorAddress: string,
  klerosContractAddress: string,
  readOnlyAppProvider: JsonRpcProvider,
  rigorousness: { amountOfJurors: number; challengeBounty: string },
  courtId: BigNumberish,
  registrationIPFSHash: string,
  clearingIPFSHash: string,
  challengePeriodDuration: number,
) {
  const kleros = Kleros__factory.connect(klerosContractAddress, readOnlyAppProvider)
  const klerosCourtInfo = await kleros.courts(courtId)
  const numberOfJurors = rigorousness.amountOfJurors
  const challengeBounty = rigorousness.challengeBounty
  const baseDeposit = klerosCourtInfo.feeForJuror.mul(numberOfJurors)

  // jurors * fee per juror + challengeBounty
  const submissionDeposit = baseDeposit.add(challengeBounty).toString()
  // The base deposit to remove an item.
  const removalDeposit = baseDeposit.add(challengeBounty).toString()
  // The base deposit to challenge a submission.
  const challengeSubmissionRequestDeposit = baseDeposit.div(2).toString()
  // The base deposit to challenge a removal request
  const challengeRemovalRequestDeposit = baseDeposit.div(4).toString()

  // Received challengePeriodDuration is considered in Dev = minutes and in Prod = Days
  const challengeDurationInSeconds = challengePeriodDuration * (isTestnet ? 1 / 60 : 24) * 60 * 60

  return defaultAbiCoder.encode(
    [
      `tuple(
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
}

export async function encodeThirdPartyBadgeModelControllerData(
  creatorAddress: string,
  administrators: string[],
) {
  return defaultAbiCoder.encode(
    [
      `tuple(
          address[],
        )`,
    ],
    [[administrators]],
  )
}

export const encodeIpfsEvidence = (ipfsEvidenceHash: string): string => {
  return defaultAbiCoder.encode([`tuple(string)`], [[ipfsEvidenceHash]])
}

export const encodeIpfsBadgeMetadata = (badgeMetadataIpsHash: string): string => {
  return defaultAbiCoder.encode([`tuple(string)`], [[badgeMetadataIpsHash]])
}

async function transformDeltaToPDF(pdfValues: z.infer<typeof DeltaPDFSchema>) {
  if (!pdfValues) return ''
  // Use NextJs dynamic import to reduce the bundle size
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { pdfExporter } = await import('@thebadge/quill-to-pdf')

  // we retrieve the delta object from the Quill instance
  // the delta is the raw content of the Quill editor
  const { delta } = pdfValues
  // we pass the delta object to the generatePdf function of the pdfExporter
  // it will resolve to a Blob of the PDF document
  return (await pdfExporter.generatePdfBase64(delta)) as string
}
