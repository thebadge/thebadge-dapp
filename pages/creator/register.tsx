import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { ethers } from 'ethers'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import RegistrationWithSteps from '@/src/pagePartials/creator/register/RegistrationWithSteps'
import { CreatorRegisterSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { PreventActionIfRegisterPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { ProfileFilter } from '@/src/pagePartials/profile/Profile'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const Register: NextPageWithLayout = () => {
  const router = useRouter()
  const { address } = useWeb3Connection()
  const { resetTxState, sendTx, state } = useTransaction()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const gql = useSubgraph()

  useEffect(() => {
    // Redirect to the creator profile section
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=${ProfileFilter.CREATED_BADGES}`)
    }
  }, [router, state])

  const userProfile = gql.useUserById({
    id: address || ethers.constants.AddressZero,
  })

  if (userProfile.data?.user?.isCreator) {
    router.push(`/profile?filter=${ProfileFilter.CREATED_BADGES}`)
  }

  async function onSubmit(data: CreatorRegisterSchemaType) {
    if (!address) {
      throw Error('Web3 address not provided')
    }

    try {
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadCreatorMetadata } = await import(
          '@/src/utils/creator/registerHelpers'
        )
        const creatorMetadataIPFSHash = await createAndUploadCreatorMetadata(data)
        return theBadge.registerUser(creatorMetadataIPFSHash, false)
      })

      if (transaction) {
        await transaction.wait()
      }
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <PreventActionIfRegisterPaused>
      <RegistrationWithSteps onSubmit={onSubmit} resetTxState={resetTxState} txState={state} />
    </PreventActionIfRegisterPaused>
  )
}

export default withPageGenericSuspense(Register)
