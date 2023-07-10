import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintSteps from '@/src/pagePartials/badge/mint/MintSteps'
import { PreventActionIfBadgeTypePaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { RequiredNotHaveBadge } from '@/src/pagePartials/errors/requiredNotHaveBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { TheBadge__factory } from '@/types/generated/typechain'
import { MetadataColumn } from '@/types/kleros/types'
import { NextPageWithLayout } from '@/types/next'
import { SupportedRelayMethods } from '@/types/relayedTx'

const MintBadgeType: NextPageWithLayout = () => {
  const { address, appChainId, isSocialWallet, userSocialInfo, web3Provider } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const { sendRelayTx, sendTx, state } = useTransaction()
  const router = useRouter()
  const badgeModelId = useModelIdParam()

  if (!badgeModelId) {
    throw `No modelId provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=badgesInReview`)
    }
  }, [router, state])

  const badgeModel = useBadgeModel(badgeModelId)
  const badgeModelKleros = useRegistrationBadgeModelKlerosMetadata(badgeModelId)

  const klerosBadgeMetadata = badgeModelKleros.data?.badgeModelKlerosRegistrationMetadata

  if (badgeModel.error || !klerosBadgeMetadata || !badgeModel.data) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  // Get kleros deposit value for the badge type
  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for badgeModel ${badgeModelId}`
  }

  const creatorFee = BigNumber.from(badgeModel.data?.badgeModel.creatorFee || 0)

  const CreateBadgeSchema = z.object(klerosSchemaFactory(klerosBadgeMetadata.metadata.columns))

  async function onSubmit(data: z.infer<typeof CreateBadgeSchema>, imageDataUrl: string) {
    // Use NextJs dynamic import to reduce the bundle size
    const { createAndUploadBadgeEvidence, createAndUploadBadgeMetadata, createKlerosValuesObject } =
      await import('@/src/utils/badges/mintHelpers')

    const values = createKlerosValuesObject(data, klerosBadgeMetadata)

    const evidenceIPFSHash = await createAndUploadBadgeEvidence(
      klerosBadgeMetadata?.metadata.columns as MetadataColumn[],
      values,
    )

    const badgeMetadataIPFSHash = await createAndUploadBadgeMetadata(
      badgeModel.data?.badgeModelMetadata as BadgeModelMetadata,
      address as string,
      { imageBase64File: imageDataUrl },
    )

    const klerosControllerDataEncoded = defaultAbiCoder.encode(
      [`tuple(string)`],
      [[evidenceIPFSHash]],
    )

    try {
      // If social login relay tx
      // @todo (agustin) add more validations, also on backend, user should be authenticated
      if (isSocialWallet && address && userSocialInfo) {
        const data = JSON.stringify({
          badgeModelId,
          address,
          badgeMetadataIPFSHash,
          klerosControllerDataEncoded,
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
        })
        return
      }
      // If user is not social logged, just send the tx
      const transaction = await sendTx(() =>
        theBadge.mint(
          badgeModelId,
          address as string,
          badgeMetadataIPFSHash,
          klerosControllerDataEncoded,
          {
            value: mintValue,
          },
        ),
      )
      await transaction.wait()
    } catch (e) {
      console.error(e)
      // Do nothing
    }
  }

  return (
    <PreventActionIfBadgeTypePaused>
      <RequiredNotHaveBadge>
        <MintSteps
          costs={{
            mintCost: formatUnits(creatorFee, 18),
            totalMintCost: formatUnits(mintValue, 18),
            klerosCost: formatUnits(mintValue.sub(creatorFee), 18),
          }}
          evidenceSchema={CreateBadgeSchema}
          onSubmit={onSubmit}
          txState={state}
        />
      </RequiredNotHaveBadge>
    </PreventActionIfBadgeTypePaused>
  )
}

export default withPageGenericSuspense(MintBadgeType)
