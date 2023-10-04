import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CreateWithSteps from '@/src/pagePartials/badge/model/CreateWithSteps'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import { BADGE_MODEL_TEXT_CONTRAST } from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TheBadgeModels__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const CreateBadgeType: NextPageWithLayout = () => {
  const { resetTxState, sendTx, state: transactionState } = useTransaction()

  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')

  const onSubmit = async (data: CreateModelSchemaType) => {
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

        const badgeModelMetadataIPFSHash = createAndUploadBadgeModelMetadata(
          name,
          description,
          badgeModelLogoUri,
          backgroundImage,
          BADGE_MODEL_TEXT_CONTRAST[textContrast],
        )

        const klerosBadgeModelControllerDataEncoded = encodeKlerosBadgeModelControllerData(
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
        )

        return theBadgeModels.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: 'kleros', // TODO kleros is hardcoded as controller for now
            mintCreatorFee: data.mintFee,
            validFor: data.validFor, // in seconds, 0 infinite
          },
          klerosBadgeModelControllerDataEncoded,
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
    <CreateWithSteps onSubmit={onSubmit} resetTxState={resetTxState} txState={transactionState} />
  )
}

export default withPageGenericSuspense(CreateBadgeType)
