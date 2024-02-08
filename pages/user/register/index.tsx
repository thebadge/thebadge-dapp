import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSignMessage } from 'wagmi'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@/src/constants/common'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import RegistrationWithSteps from '@/src/pagePartials/creator/register/RegistrationWithSteps'
import { CreatorRegisterSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { PreventActionIfRegisterPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { NormalProfileFilter } from '@/src/pagePartials/profile/UserProfile'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const Register: NextPageWithLayout = () => {
  const router = useRouter()
  const { address, readOnlyChainId } = useWeb3Connection()
  const { resetTxState, sendTx, state } = useTransaction()
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    // Redirect to the creator profile section
    if (state === TransactionStates.success) {
      router.push(generateProfileUrl({ filter: NormalProfileFilter.CREATED_BADGES }))
    }
  }, [router, state])

  const { data: userProfile } = useUserById(address)

  if (userProfile?.isRegistered) {
    router.push(
      generateProfileUrl({
        filter: NormalProfileFilter.CREATED_BADGES,
        connectedChainId: readOnlyChainId,
      }),
    )
  }

  async function onSubmit(data: CreatorRegisterSchemaType) {
    if (!address) {
      throw Error('Web3 address not provided')
    }

    try {
      // Message asking the user to accept the terms and privacy policy
      const message = `By signing this message, you confirm your acceptance of our [Terms and Conditions](${TERMS_AND_CONDITIONS_URL}) and [Privacy Policy](${PRIVACY_POLICY_URL}).`

      const signature = await signMessageAsync({ message })
      if (!signature) {
        throw new Error('User rejected the signing of the message.')
      }
      // TODO store the signature on the relayer
      localStorage.setItem('terms-and-conditions-accepted', JSON.stringify({ signature }))
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadCreatorMetadata } = await import(
          '@/src/utils/creator/registerHelpers'
        )
        const creatorMetadataIPFSHash = await createAndUploadCreatorMetadata(data)
        return `theBadgeUsers.registerUser(creatorMetadataIPFSHash, false)`
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
