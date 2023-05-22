import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintSteps from '@/src/pagePartials/badge/mint/MintSteps'
import { PreventActionIfBadgeTypePaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { RequiredNotHaveBadge } from '@/src/pagePartials/errors/requiredNotHaveBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const MintBadgeType: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const { sendTx, state } = useTransaction()
  const router = useRouter()

  const badgeModelId = router.query.modelId as string
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

  if (badgeModel.error || !klerosBadgeMetadata) {
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
    const values: Record<string, unknown> = {}
    Object.keys(data).forEach((key) => (values[key] = data[key]))

    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        columns: klerosBadgeMetadata?.metadata.columns,
        image: { mimeType: 'image/png', base64File: imageDataUrl },
        values,
      },
      filePaths: ['image'],
    })

    const klerosControllerDataEncoded = defaultAbiCoder.encode(
      [`tuple(string)`],
      [
        [
          `ipfs://${evidenceIPFSUploaded.result?.ipfsHash}`, // evidence
        ],
      ],
    )

    try {
      const transaction = await sendTx(() =>
        theBadge.mint(
          badgeModelId, // badgeModelId
          address as string, // wallet
          'ipfs://', // metadata para el badge //TODO
          klerosControllerDataEncoded,
          {
            value: mintValue,
          },
        ),
      )

      await transaction.wait()
    } catch (e) {
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
            klerosCost: formatUnits(0, 18), // TODO fix this by checking the deposit cost. It has to be a dynamic call to klerosController
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
