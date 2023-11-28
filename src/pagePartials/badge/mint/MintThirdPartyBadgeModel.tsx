import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { notify } from '@/src/components/toast/Toast'
import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useBadgeModelThirdPartyMetadata } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import useTBContract from '@/src/hooks/theBadge/useTBContract'
import useTBStore from '@/src/hooks/theBadge/useTBStore'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintThirdPartyWithSteps from '@/src/pagePartials/badge/mint/MintThirdPartyWithSteps'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { cleanMintFormValues } from '@/src/pagePartials/badge/mint/utils'
import { PreventActionIfNoBadgeModelCreator } from '@/src/pagePartials/errors/preventActionIfNoBadgeModelCreator'
import { PreventActionIfBadgeModelPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import {
  createAndUploadThirdPartyRequiredData,
  createThirdPartyValuesObject,
} from '@/src/utils/badges/mintHelpers'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { getEncryptedValues, sendEmailClaim } from '@/src/utils/relayTx'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { NextPageWithLayout } from '@/types/next'
import { ToastStates } from '@/types/toast'

const MintThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { appChainId, getSocialCompressedPubKey, isSocialWallet, web3Auth } = useWeb3Connection()
  const theBadge = useTBContract()
  const theBadgeStore = useTBStore()
  const { resetTxState, sendTx, state } = useTransaction()
  const router = useRouter()
  const { badgeModelId, contract } = useModelIdParam()

  if (!badgeModelId) {
    throw `No modelId provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(generateProfileUrl())
    }
  }, [router, state])

  const badgeModel = useBadgeModel(badgeModelId, contract)
  const requiredBadgeDataMetadata = useBadgeModelThirdPartyMetadata(badgeModelId)

  if (badgeModel.error || !badgeModel.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }

  async function onSubmit(data: MintThirdPartySchemaType) {
    const { destination, preferMintMethod, previewImage, requiredData } = data

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadThirdPartyBadgeMetadata } = await import(
          '@/src/utils/badges/mintHelpers'
        )
        const { encodeIpfsThirdPartyRequiredData } = await import(
          '@/src/utils/badges/createBadgeModelHelpers'
        )

        let encryptedValues: string | null = null

        if (destination) {
          const encryptionResult = await getEncryptedValues(appChainId.toString(), {
            email: destination,
          })
          encryptedValues = encryptionResult ? encryptionResult : null
        }

        const thirdPartyValues = requiredData
          ? { ...requiredData, encryptedPayload: encryptedValues }
          : { encryptedPayload: encryptedValues }

        const requiredDataValues = createThirdPartyValuesObject(
          thirdPartyValues,
          requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns,
        )

        const estimatedBadgeId = await theBadgeStore.getCurrentBadgeIdCounter()

        const [requiredDataIPFSHash, badgeMetadataIPFSHash] = await Promise.all([
          createAndUploadThirdPartyRequiredData(
            requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns || [],
            { ...requiredDataValues, encryptedPayload: encryptedValues },
          ),
          createAndUploadThirdPartyBadgeMetadata({
            estimatedBadgeId: estimatedBadgeId.toString(),
            theBadgeContractAddress: theBadge.address,
            appChainId,
            badgeModelMetadata: badgeModel.data?.badgeModelMetadata as BadgeModelMetadata,
            additionalArgs: { imageBase64File: previewImage },
          }),
        ])

        const encodedBadgeRequiredData = encodeIpfsThirdPartyRequiredData(requiredDataIPFSHash)

        // Social wallet information
        const userSocialInfo = isSocialWallet ? await web3Auth?.getUserInfo() : null
        const appPubKey = isSocialWallet ? await getSocialCompressedPubKey() : null

        // If social login relay tx
        if (isSocialWallet && destination && userSocialInfo && appPubKey) {
          // TODO Implement social login (or maybe create a hook that encapsulates this logic)
        }

        // If user is not social logged, just send the tx
        return theBadge.mint(
          badgeModelId,
          preferMintMethod === 'email' ? ZERO_ADDRESS : destination,
          badgeMetadataIPFSHash,
          encodedBadgeRequiredData,
          {
            value: mintValue,
          },
        )
      })
      if (transaction) {
        const { transactionHash } = await transaction.wait()

        // TODO This should be done async, notifying the relayer before sending the tx, or asking the relayer to send the tx
        if (preferMintMethod === 'email') {
          await sendEmailClaim({
            networkId: appChainId.toString(),
            mintTxHash: transactionHash,
            badgeModelId: Number(badgeModelId),
            emailClaimer: destination,
          })
          notify({
            id: transactionHash,
            type: ToastStates.info,
            message: `Email successfully sent to: ${destination}`,
            position: 'top-right',
          })
        }
      }
      cleanMintFormValues(badgeModelId)
    } catch (e) {
      console.error(e)
      // Do nothing
    }
  }

  return (
    <PreventActionIfBadgeModelPaused>
      <PreventActionIfNoBadgeModelCreator>
        <MintThirdPartyWithSteps onSubmit={onSubmit} resetTxState={resetTxState} txState={state} />
      </PreventActionIfNoBadgeModelCreator>
    </PreventActionIfBadgeModelPaused>
  )
}

export default withPageGenericSuspense(MintThirdPartyBadgeModel)
