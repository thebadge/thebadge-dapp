import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { notify } from '@/src/components/toast/Toast'
import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintThirdPartyWithSteps from '@/src/pagePartials/badge/mint/MintThirdPartyWithSteps'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { cleanMintFormValues } from '@/src/pagePartials/badge/mint/utils'
import { PreventActionIfNoBadgeModelCreator } from '@/src/pagePartials/errors/preventActionIfNoBadgeModelCreator'
import { PreventActionIfBadgeModelPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { sendEmailClaim } from '@/src/utils/relayTx'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'
import { ToastStates } from '@/types/toast'

const MintThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { appChainId, appPubKey, isSocialWallet, userSocialInfo } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const { resetTxState, sendTx, state } = useTransaction()
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

  if (badgeModel.error || !badgeModel.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }

  async function onSubmit(data: MintThirdPartySchemaType) {
    const { destination, preferMintMethod, previewImage } = data

    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadThirdPartyBadgeMetadata } = await import(
          '@/src/utils/badges/mintHelpers'
        )
        const { encodeIpfsBadgeMetadata } = await import(
          '@/src/utils/badges/createBadgeModelHelpers'
        )

        const badgeMetadataIPFSHash = await createAndUploadThirdPartyBadgeMetadata(
          badgeModel.data?.badgeModelMetadata as BadgeModelMetadata,
          badgeModelId,
          { imageBase64File: previewImage },
        )
        const encodedBadgeMetadata = encodeIpfsBadgeMetadata(badgeMetadataIPFSHash)

        // If social login relay tx
        if (isSocialWallet && destination && userSocialInfo && appPubKey) {
          // TODO Implement social login (or maybe create a hook that encapsulates this logic)
        }

        // If user is not social logged, just send the tx
        return theBadge.mint(
          badgeModelId,
          preferMintMethod === 'email' ? ZERO_ADDRESS : destination,
          badgeMetadataIPFSHash,
          // TODO Check if this makes sense or not
          encodedBadgeMetadata,
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
