import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CreateThirdPartyBadgeModelWithSteps from '@/src/pagePartials/badge/model/CreateThirdPartyBadgeModelWithSteps'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { BadgeModelControllerName } from '@/types/badges/BadgeModel'
import { TheBadgeModels__factory } from '@/types/generated/typechain'
import { KLEROS_LIST_TYPES } from '@/types/kleros/types'
import { NextPageWithLayout } from '@/types/next'

const CreateThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state: transactionState } = useTransaction()

  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')

  const onSubmit = async (data: CreateThirdPartyModelSchemaType) => {
    const { administrators } = data

    console.log('onSubmit', data)
    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const {
          createAndUploadBadgeModelMetadata,
          createAndUploadThirdPartyBadgeModelRequirements,
          encodeThirdPartyBadgeModelControllerData,
        } = await import('@/src/utils/badges/createBadgeModelHelpers')

        // Hardcoded Required metadata for the Diploma use case
        const badgeMetadataColumns = [
          {
            label: 'studentName',
            description: 'You must add your name and surname, to have your diploma',
            type: KLEROS_LIST_TYPES.TEXT,
            isIdentifier: false,
          },
        ]

        const requirementsPFSHash = await createAndUploadThirdPartyBadgeModelRequirements(
          badgeMetadataColumns,
        )

        // Should we save this on the Controller o on the Metadata?
        // Community badges has it on controller
        console.log('requirementsPFSHash', requirementsPFSHash)

        const [badgeModelMetadataIPFSHash, thirdPartyBadgeModelControllerDataEncoded] =
          await Promise.all([
            createAndUploadBadgeModelMetadata(data),
            encodeThirdPartyBadgeModelControllerData([administrators]), // TODO replace
          ])

        if (!badgeModelMetadataIPFSHash) {
          throw `There was an error uploading the data, try again`
        }

        return theBadgeModels.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: BadgeModelControllerName.ThirdParty,
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          thirdPartyBadgeModelControllerDataEncoded,
          {
            value: 0,
          },
        )
      })
      if (transaction) {
        await transaction.wait()
      }
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <CreateThirdPartyBadgeModelWithSteps
      onSubmit={onSubmit}
      resetTxState={resetTxState}
      txState={transactionState}
    />
  )
}

export default withPageGenericSuspense(CreateThirdPartyBadgeModel)
