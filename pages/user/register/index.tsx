import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import RegistrationWithSteps from '@/src/pagePartials/creator/register/RegistrationWithSteps'
import { CreatorRegisterSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { PreventActionIfRegisterPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { NormalProfileFilter } from '@/src/pagePartials/profile/UserProfile'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const Register: NextPageWithLayout = () => {
  const router = useRouter()
  const { address } = useWeb3Connection()
  const { resetTxState, sendTx, state } = useTransaction()
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')

  useEffect(() => {
    // Redirect to the creator profile section
    if (state === TransactionStates.success) {
      router.push(generateProfileUrl({ filter: NormalProfileFilter.CREATED_BADGES }))
    }
  }, [router, state])

  const { data: userProfile } = useUserById(address)

  if (userProfile?.isCreator) {
    router.push(generateProfileUrl({ filter: NormalProfileFilter.CREATED_BADGES }))
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
        return theBadgeUsers.registerUser(creatorMetadataIPFSHash, false)
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
