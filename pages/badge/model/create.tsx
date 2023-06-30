import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { parseUnits } from 'ethers/lib/utils'

import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import CreateWithSteps from '@/src/pagePartials/badge/model/CreateWithSteps'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { RequiredCreatorAccess } from '@/src/pagePartials/errors/requiresCreatorAccess'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

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

  const onSubmit = async (data: CreateModelSchemaType) => {
    const {
      badgeMetadataColumns,
      badgeModelLogoUri,
      challengePeriodDuration,
      criteria,
      description,
      name,
      rigorousness,
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
          encodeKlerosControllerData,
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
        )

        const klerosControllerDataEncoded = encodeKlerosControllerData(
          address as string,
          contracts.Kleros.address[appChainId],
          readOnlyAppProvider,
          rigorousness,
          /**
           * Default Kleros court to use when creating a new badge model.
           * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
           * In advance mode the user should be able to select the court.
           */
          process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT as string,
          registrationIPFSHash,
          clearingIPFSHash,
          challengePeriodDuration,
        )

        return theBadge.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
            controllerName: 'kleros',
            mintCreatorFee: parseUnits(data.mintCost.toString(), 18),
            validFor: data.validFor, // in seconds, 0 infinite
          },
          klerosControllerDataEncoded,
        )
      })

      await transaction.wait()
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <RequiredConnection>
      <RequiredCreatorAccess>
        <CreateWithSteps onSubmit={onSubmit} txState={state} />
      </RequiredCreatorAccess>
    </RequiredConnection>
  )
}

export default withPageGenericSuspense(CreateBadgeType)
