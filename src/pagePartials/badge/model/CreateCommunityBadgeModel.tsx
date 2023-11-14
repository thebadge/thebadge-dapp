import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CreateCommunityBadgeModelWithSteps from '@/src/pagePartials/badge/model/CreateCommunityBadgeModelWithSteps'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import { BADGE_MODEL_TEXT_CONTRAST } from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { BadgeModelControllerName } from '@/types/badges/BadgeModel'
import { TheBadgeModels__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const CreateCommunityBadgeModel: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state: transactionState } = useTransaction()

  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')

  const onSubmit = async (data: CreateCommunityModelSchemaType) => {
    const {
      backgroundImage,
      badgeMetadataColumns,
      badgeModelLogoUri,
      challengePeriodDuration,
      criteria,
      description,
      name,
      rigorousness,
      textContrast,
    } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const {
          createAndUploadBadgeModelMetadata,
          createAndUploadClearingAndRegistrationFilesForKleros,
          encodeKlerosBadgeModelControllerData,
        } = await import('@/src/utils/badges/createBadgeModelHelpers')

        const { clearingIPFSHash, registrationIPFSHash } =
          await createAndUploadClearingAndRegistrationFilesForKleros(
            name,
            description,
            badgeModelLogoUri,
            criteria,
            badgeMetadataColumns,
          )

        const [badgeModelMetadataIPFSHash, klerosBadgeModelControllerDataEncoded] =
          await Promise.all([
            createAndUploadBadgeModelMetadata(
              name,
              description,
              badgeModelLogoUri,
              backgroundImage,
              BADGE_MODEL_TEXT_CONTRAST[textContrast],
            ),
            encodeKlerosBadgeModelControllerData(
              address as string,
              contracts.Kleros.address[appChainId],
              readOnlyAppProvider,
              rigorousness,
              /**
               * Default Kleros court to use when creating a new badge model.
               * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
               * In advance mode the user should be able to select the court.
               */
              DEFAULT_COURT_ID,
              registrationIPFSHash,
              clearingIPFSHash,
              challengePeriodDuration,
            ),
          ])

        return theBadgeModels.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: BadgeModelControllerName.Kleros,
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          klerosBadgeModelControllerDataEncoded,
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
    <CreateCommunityBadgeModelWithSteps
      onSubmit={onSubmit}
      resetTxState={resetTxState}
      txState={transactionState}
    />
  )
}

export default withPageGenericSuspense(CreateCommunityBadgeModel)
