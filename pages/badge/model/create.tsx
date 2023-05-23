import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { constants } from 'ethers'
import { defaultAbiCoder, parseUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { IS_DEVELOP } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import CreateSteps, { BadgeTypeCreateSchema } from '@/src/pagePartials/badge/type/CreateSteps'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { RequiredCreatorAccess } from '@/src/pagePartials/errors/requiresCreatorAccess'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { generateKlerosListMetaEvidence } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { Kleros__factory, TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'
import { Severity } from '@/types/utils'

const CreateBadgeType: NextPageWithLayout = () => {
  const { sendTx, state } = useTransaction()
  const router = useRouter()

  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  useEffect(() => {
    // Redirect to the creator profile section
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=createdBadges`)
    }
  }, [router, state])

  const onSubmit = async (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    const { badgeMetadataColumns, criteriaFileUri, description, logoUri, name } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

    const { clearing, registration } = generateKlerosListMetaEvidence(
      name, //badgeName
      {
        mimeType: criteriaFileUri?.file.type,
        base64File: criteriaFileUri?.data_url,
      }, //criteriaFileUri
      name, //badgeModelName
      description, //badgeModelDescription
      badgeMetadataColumns, //badgeMetadataColumns
      { mimeType: logoUri?.file.type, base64File: logoUri?.data_url }, //badgeModelLogoUri
    )
    const registrationIPFSUploaded = await ipfsUpload({
      attributes: registration,
      filePaths: ['fileURI', 'metadata.logoURI'],
    })

    const clearingIPFSUploaded = await ipfsUpload({
      attributes: clearing,
      filePaths: ['fileURI', 'metadata.logoURI'],
    })

    const badgeModelIPFSUploaded = await ipfsUpload({
      attributes: {
        description: data.description,
        image: { mimeType: logoUri?.file.type, base64File: logoUri?.data_url },
        name: name,
      },
      filePaths: ['image'],
    })

    const kleros = Kleros__factory.connect(
      contracts.Kleros.address[appChainId],
      readOnlyAppProvider,
    )
    const numberOfJurors = Severity[data.rigorousness as keyof typeof Severity]
    const klerosCourtInfo = await kleros.courts(0) // TODO: fixed for now
    const baseDeposit = klerosCourtInfo.feeForJuror.mul(numberOfJurors)

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
          address as string, // governor
          constants.AddressZero, // admin
          0, // courtId, Fixed for now. Let's use General court
          numberOfJurors, // numberOfJurors:
          `ipfs://${registrationIPFSUploaded.result?.ipfsHash}`, // registration file
          `ipfs://${clearingIPFSUploaded.result?.ipfsHash}`, // clearing file
          data.challengePeriodDuration * (IS_DEVELOP ? 1 : 24) * 60 * 60, // challengePeriodDuration // Dev = hours - Prod = Days
          [
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(numberOfJurors)).toString(), // jurors * fee per juror + rigorousness
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(numberOfJurors)).toString(), // The base deposit to remove an item.
            baseDeposit.div(2).toString(), // The base deposit to challenge a submission.
            baseDeposit.div(4).toString(), // The base deposit to challenge a removal request.
          ], // baseDeposits:
          [100, 100, 100], // stakeMultipliers:
        ],
      ],
    )
    try {
      const transaction = await sendTx(() =>
        theBadge.createBadgeModel(
          {
            metadata: `ipfs://${badgeModelIPFSUploaded.result?.ipfsHash}`,
            controllerName: 'kleros',
            mintCreatorFee: parseUnits(data.mintCost.toString(), 18),
            validFor: data.validFor, // in seconds, 0 infinite
          },
          klerosControllerDataEncoded,
        ),
      )

      await transaction.wait()
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <RequiredConnection>
      <RequiredCreatorAccess>
        <CreateSteps onSubmit={onSubmit} txState={state} />
      </RequiredCreatorAccess>
    </RequiredConnection>
  )
}

export default withPageGenericSuspense(CreateBadgeType)
