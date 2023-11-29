import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useCreateModelFeeValue from '@/src/hooks/theBadge/useCreateModelFeeValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CreateThirdPartyBadgeModelWithSteps from '@/src/pagePartials/badge/model/CreateThirdPartyBadgeModelWithSteps'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BadgeModelControllerName, BadgeModelTemplate } from '@/types/badges/BadgeModel'
import { TheBadgeModels__factory } from '@/types/generated/typechain'
import { KLEROS_LIST_TYPES, ThirdPartyMetadataColumn } from '@/types/kleros/types'
import { NextPageWithLayout } from '@/types/next'

const CreateThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state: transactionState } = useTransaction()
  const { data: createModelProtocolFee } = useCreateModelFeeValue()
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')
  const { address } = useWeb3Connection()

  const onSubmit = async (data: CreateThirdPartyModelSchemaType) => {
    const administrators = address as string // TODO Replace once is well done
    //const { administrators } = data

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
        const badgeMetadataColumns: ThirdPartyMetadataColumn[] =
          data.template === BadgeModelTemplate.Diploma
            ? [
                // Diploma required fields
                {
                  label: 'Student Name',
                  description: 'You must add your name and surname, to have your diploma',
                  type: KLEROS_LIST_TYPES.TEXT,
                  // Key that is going to be used to search and replace the value on
                  // the diploma, like {{studentName}}
                  replacementKey: 'studentName',
                  isIdentifier: false,
                },
              ]
            : [] // Badge required fields

        const requirementsIPFSHash = await createAndUploadThirdPartyBadgeModelRequirements(
          badgeMetadataColumns,
        )

        const [badgeModelMetadataIPFSHash, thirdPartyBadgeModelControllerDataEncoded] =
          await Promise.all([
            createAndUploadBadgeModelMetadata(data),
            encodeThirdPartyBadgeModelControllerData([administrators], requirementsIPFSHash),
          ])

        if (!badgeModelMetadataIPFSHash) {
          throw `There was an error uploading the data, try again`
        }

        console.log({
          asd: {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: BadgeModelControllerName.ThirdParty,
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          thirdPartyBadgeModelControllerDataEncoded,
          value: 0,
        })
        return theBadgeModels.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: BadgeModelControllerName.ThirdParty,
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          thirdPartyBadgeModelControllerDataEncoded,
          {
            value: createModelProtocolFee,
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
