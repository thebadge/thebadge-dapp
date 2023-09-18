import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintWithSteps from '@/src/pagePartials/badge/mint/MintWithSteps'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { cleanMintFormValues } from '@/src/pagePartials/badge/mint/utils'
import { PreventActionIfBadgeTypePaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { RequiredNotHaveBadge } from '@/src/pagePartials/errors/requiredNotHaveBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'
import { SupportedRelayMethods } from '@/types/relayedTx'
import { encodeIpfsEvidence } from '@/src/utils/badges/createBadgeModelHelpers'

const MintThirdPartyBadgeModel: NextPageWithLayout = () => {
  const { address, appChainId, appPubKey, isSocialWallet, userSocialInfo, web3Provider } =
    useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const { resetTxState, sendRelayTx, sendTx, state } = useTransaction()
  const router = useRouter()
  const badgeModelId = useModelIdParam()
  const controllerType = useControllerTypeParam()
  console.log('test1')
  const test = encodeIpfsEvidence('0x0dc0dfD22C6Beab74672EADE5F9Be5234AAa43cC')
  console.log('Test!', test)

  if (!badgeModelId) {
    throw `No modelId provided us URL query param`
  }

  if (!controllerType) {
    throw `No controllerType provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(`/profile`)
    }
  }, [router, state])

  const badgeModel = useBadgeModel(badgeModelId)
  console.log('MintThirdPartyBadgeModel', badgeModel.data)

  if (badgeModel.error || !badgeModel.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }

  async function onSubmit(data: MintBadgeSchemaType) {
    try {
      // Start transaction to show the loading state when we create the files
      // and configs
      const transaction = await sendTx(async () => {
        const { previewImage } = data
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadBadgeMetadata } = await import('@/src/utils/badges/mintHelpers')

        const badgeMetadataIPFSHash = await createAndUploadBadgeMetadata(
          badgeModel.data?.badgeModelMetadata as BadgeModelMetadata,
          address as string,
          { imageBase64File: previewImage },
        )

        // If social login relay tx
        if (isSocialWallet && address && userSocialInfo && appPubKey) {
          const data = JSON.stringify({
            badgeModelId,
            address,
            badgeMetadataIPFSHash,
            overrides: {
              value: mintValue,
            },
          })

          const signature = await web3Provider?.getSigner().signMessage(data)

          if (!signature) {
            throw new Error('User rejected the signing of the message')
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
        return theBadge.mint(badgeModelId, address as string, badgeMetadataIPFSHash, '0x', {
          value: mintValue,
        })
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
    <PreventActionIfBadgeTypePaused>
      <RequiredNotHaveBadge>
        <MintWithSteps onSubmit={onSubmit} resetTxState={resetTxState} txState={state} />
      </RequiredNotHaveBadge>
    </PreventActionIfBadgeTypePaused>
  )
}

export default withPageGenericSuspense(MintThirdPartyBadgeModel)
