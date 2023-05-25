import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { parseUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import CreateSteps, { BadgeTypeCreateSchema } from '@/src/pagePartials/badge/type/CreateSteps'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { RequiredCreatorAccess } from '@/src/pagePartials/errors/requiresCreatorAccess'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TheBadge__factory } from '@/types/generated/typechain'
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
    const {
      badgeMetadataColumns,
      badgeModelLogoUri,
      challengePeriodDuration,
      criteriaFileUri,
      description,
      name,
      rigorousness,
    } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

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
        criteriaFileUri,
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
      Severity[rigorousness as keyof typeof Severity],
      0, //Fixed for now
      registrationIPFSHash,
      clearingIPFSHash,
      challengePeriodDuration,
    )

    try {
      const transaction = await sendTx(() =>
        theBadge.createBadgeModel(
          {
            metadata: badgeModelMetadataIPFSHash,
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
