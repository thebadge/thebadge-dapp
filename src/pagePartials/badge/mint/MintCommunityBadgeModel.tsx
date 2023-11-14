import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { useSignMessage } from 'wagmi'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import useTBContract from '@/src/hooks/theBadge/useTBContract'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintCommunityWithSteps from '@/src/pagePartials/badge/mint/MintCommunityWithSteps'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { cleanMintFormValues } from '@/src/pagePartials/badge/mint/utils'
import { PreventActionIfBadgeModelPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { RequiredNotHaveBadge } from '@/src/pagePartials/errors/requiredNotHaveBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { encodeIpfsEvidence } from '@/src/utils/badges/createBadgeModelHelpers'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { MetadataColumn } from '@/types/kleros/types'
import { NextPageWithLayout } from '@/types/next'
import { SupportedRelayMethods } from '@/types/relayedTx'

const MintCommunityBadgeModel: NextPageWithLayout = () => {
  const { address, appChainId, getSocialCompressedPubKey, isSocialWallet, web3Auth } =
    useWeb3Connection()
  const { signMessageAsync } = useSignMessage()
  const theBadge = useTBContract()
  const { resetTxState, sendRelayTx, sendTx, state } = useTransaction()
  const router = useRouter()
  const badgeModelId = useModelIdParam()

  if (!badgeModelId) {
    throw `No modelId provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(generateProfileUrl())
    }
  }, [router, state])

  const badgeModel = useBadgeModel(badgeModelId)
  const badgeModelKleros = useRegistrationBadgeModelKlerosMetadata(badgeModelId)

  const klerosBadgeMetadata = badgeModelKleros.data?.badgeModelKlerosRegistrationMetadata

  if (badgeModel.error || !klerosBadgeMetadata || !badgeModel.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  // Get kleros deposit value for the badge model
  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }

  async function onSubmit(data: MintBadgeSchemaType) {
    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        const { evidence, previewImage } = data
        // Use NextJs dynamic import to reduce the bundle size
        const {
          createAndUploadBadgeEvidence,
          createAndUploadBadgeMetadata,
          createKlerosValuesObject,
        } = await import('@/src/utils/badges/mintHelpers')

        const values = createKlerosValuesObject(evidence, klerosBadgeMetadata)

        const [evidenceIPFSHash, badgeMetadataIPFSHash] = await Promise.all([
          createAndUploadBadgeEvidence(
            klerosBadgeMetadata?.metadata.columns as MetadataColumn[],
            values,
          ),
          createAndUploadBadgeMetadata(
            badgeModel.data?.badgeModelMetadata as BadgeModelMetadata,
            address as string,
            { imageBase64File: previewImage },
          ),
        ])

        const klerosBadgeModelControllerDataEncoded = encodeIpfsEvidence(evidenceIPFSHash)

        // If social login relay tx
        if (isSocialWallet && address) {
          const data = JSON.stringify({
            badgeModelId,
            address,
            badgeMetadataIPFSHash,
            klerosBadgeModelControllerDataEncoded,
            overrides: {
              value: mintValue,
            },
          })

          const signature = await signMessageAsync({ message: data })

          if (!signature) {
            throw new Error('User rejected the signing of the message.')
          }

          const userSocialInfo = await web3Auth?.getUserInfo()
          const appPubKey = await getSocialCompressedPubKey()

          if (!userSocialInfo || !appPubKey) {
            throw new Error('User information is missing.')
          }

          // Send to backend
          await sendRelayTx({
            data,
            from: address,
            chainId: appChainId.toString(),
            method: SupportedRelayMethods.MINT,
            signature,
            userAccount: {
              address,
              userSocialInfo,
            },
            appPubKey,
          })
        }

        // If user is not social logged, just send the tx
        return theBadge.mint(
          badgeModelId,
          address as string,
          badgeMetadataIPFSHash,
          klerosBadgeModelControllerDataEncoded,
          {
            value: mintValue,
          },
        )
      })
      if (transaction) {
        await transaction.wait()
      }
      cleanMintFormValues(badgeModelId)
    } catch (e) {
      console.error(e)
      // Do nothing
    }
  }

  return (
    <PreventActionIfBadgeModelPaused>
      <RequiredNotHaveBadge ownerAddress={address}>
        <MintCommunityWithSteps onSubmit={onSubmit} resetTxState={resetTxState} txState={state} />
      </RequiredNotHaveBadge>
    </PreventActionIfBadgeModelPaused>
  )
}

export default withPageGenericSuspense(MintCommunityBadgeModel)
