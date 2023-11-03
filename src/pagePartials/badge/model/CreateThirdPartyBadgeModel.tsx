import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CreateThirdPartyBadgeModelWithSteps from '@/src/pagePartials/badge/model/CreateThirdPartyBadgeModelWithSteps'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { BADGE_MODEL_TEXT_CONTRAST } from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import { BadgeModelControllerName } from '@/types/badges/BadgeModel'
import { TheBadgeModels__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const CreateThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state: transactionState } = useTransaction()

  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')

  const onSubmit = async (data: CreateThirdPartyModelSchemaType) => {
    const { administrators, backgroundImage, badgeModelLogoUri, description, name, textContrast } =
      data

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadBadgeModelMetadata, encodeThirdPartyBadgeModelControllerData } =
          await import('@/src/utils/badges/createBadgeModelHelpers')

        const [badgeModelMetadataIPFSHash, thirdPartyBadgeModelControllerDataEncoded] =
          await Promise.all([
            createAndUploadBadgeModelMetadata(
              name,
              description,
              badgeModelLogoUri,
              backgroundImage,
              BADGE_MODEL_TEXT_CONTRAST[textContrast],
            ),
            encodeThirdPartyBadgeModelControllerData([administrators]), // TODO replace
          ])

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
