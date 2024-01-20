import * as React from 'react'

import { ContractTransaction } from '@ethersproject/contracts'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useBadgeModelThirdPartyMetadata } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import useSendClaimNotificationEmail from '@/src/hooks/theBadge/useSendClaimNotificationEmail'
import useSendMintNotificationEmail from '@/src/hooks/theBadge/useSendMintNotificationEmail'
import useTBContract from '@/src/hooks/theBadge/useTBContract'
import useTBStore from '@/src/hooks/theBadge/useTBStore'
import useTransaction from '@/src/hooks/useTransaction'
import MintThirdPartyWithSteps from '@/src/pagePartials/badge/mint/MintThirdPartyWithSteps'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { cleanMintFormValues } from '@/src/pagePartials/badge/mint/utils'
import { PreventActionIfNoBadgeModelCreator } from '@/src/pagePartials/errors/preventActionIfNoBadgeModelCreator'
import { PreventActionIfBadgeModelPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import {
  createAndUploadThirdPartyRequiredData,
  createThirdPartyValuesObject,
} from '@/src/utils/badges/mintHelpers'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { getEncryptedValues } from '@/src/utils/relayTx'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { NextPageWithLayout } from '@/types/next'

const MintThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { appChainId, getSocialCompressedPubKey, isSocialWallet, web3Auth } = useWeb3Connection()
  const theBadge = useTBContract()
  const theBadgeStore = useTBStore()
  const { resetTxState, sendTx, state } = useTransaction()
  const { badgeModelId, contract } = useModelIdParam()
  const { prepareClaimNotificationEmailWithSignature, sendClaimNotificationEmail } =
    useSendClaimNotificationEmail()
  const { prepareMintNotificationEmailWithSignature, sendMintNotificationEmail } =
    useSendMintNotificationEmail()

  if (!badgeModelId) {
    throw `No modelId provided us URL query param`
  }

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
    const { destination, notificationEmail, preferMintMethod, previewImage, requiredData } = data
    let emailMessageSignature = ''

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const contractTransaction = await sendTx(async (): Promise<ContractTransaction> => {
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

        // Sign message to the send the email
        if (preferMintMethod === 'address' && notificationEmail) {
          emailMessageSignature = await prepareMintNotificationEmailWithSignature()
        } else {
          emailMessageSignature = await prepareClaimNotificationEmailWithSignature()
        }

        // If user is not social logged, just send the tx
        const transactionReceipt = await theBadge.mint(
          badgeModelId,
          preferMintMethod === 'email' ? ZERO_ADDRESS : destination,
          badgeMetadataIPFSHash,
          encodedBadgeRequiredData,
          {
            value: mintValue,
          },
        )
        return transactionReceipt
      })

      if (contractTransaction) {
        const { transactionHash } = await contractTransaction.wait()

        if (preferMintMethod === 'email') {
          await sendClaimNotificationEmail(transactionHash, {
            networkId: appChainId.toString(),
            badgeModelId: Number(badgeModelId),
            emailClaimer: destination,
            emailMessageSignature,
          })
        }
        if (preferMintMethod === 'address' && notificationEmail) {
          await sendMintNotificationEmail(transactionHash, {
            networkId: appChainId.toString(),
            badgeModelId: Number(badgeModelId),
            emailRecipient: notificationEmail,
            emailMessageSignature,
          })
        }
        cleanMintFormValues(badgeModelId)
      }
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
