import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useBadgeType from '@/src/hooks/subgraph/useBadgeType'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintSteps from '@/src/pagePartials/badge/mint/MintSteps'
import useKlerosDepositPrice from '@/src/pagePartials/badge/useKlerosDepositPrice'
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

  const badgeTypeId = router.query.typeId as string
  if (!badgeTypeId) {
    throw `No typeId provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=badgesInReview`)
    }
  }, [router, state])

  const badgeTypeData = useBadgeType(badgeTypeId)

  if (
    badgeTypeData.error ||
    !badgeTypeData.data?.badgeType ||
    !badgeTypeData.data?.badgeTypeMetadata
  ) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const badgeType = badgeTypeData.data?.badgeType
  const badgeTypeMetadata = badgeTypeData.data?.badgeTypeMetadata

  // Get kleros deposit value for the badge type
  const klerosCost = useKlerosDepositPrice(badgeTypeId)
  if (!klerosCost) {
    throw `There was not possible to get Kleros deposit price for badge type ${badgeTypeId}`
  }

  const mintCost = BigNumber.from(badgeType.mintCost || 0)
  const totalMintCost = mintCost.add(klerosCost)

  const CreateBadgeSchema = z.object(klerosSchemaFactory(badgeTypeMetadata.metadata.columns))

  async function onSubmit(data: z.infer<typeof CreateBadgeSchema>, imageDataUrl: string) {
    const values: Record<string, unknown> = {}
    Object.keys(data).forEach((key) => (values[key] = data[key]))

    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        columns: badgeTypeMetadata.metadata.columns,
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
        theBadge.requestBadge(badgeTypeId, address as string, klerosControllerDataEncoded, {
          value: totalMintCost,
        }),
      )

      await transaction.wait()
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <RequiredNotHaveBadge>
      <MintSteps
        costs={{
          mintCost: formatUnits(mintCost, 18),
          totalMintCost: formatUnits(totalMintCost, 18),
          klerosCost: formatUnits(klerosCost, 18),
        }}
        evidenceSchema={CreateBadgeSchema}
        onSubmit={onSubmit}
        txState={state}
      />
    </RequiredNotHaveBadge>
  )
}

export default withPageGenericSuspense(MintBadgeType)
