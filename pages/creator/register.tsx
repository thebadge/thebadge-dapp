import { ProfileFilter } from "@/src/pagePartials/profile/Profile";
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { ethers } from 'ethers'
import { z } from 'zod'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import RegistrationSteps, {
  RegisterCuratorSchemaStep1,
  RegisterCuratorSchemaStep2,
  RegisterCuratorSchemaStep3,
} from '@/src/pagePartials/creator/register/RegistrationSteps'
import { PreventActionIfRegisterPaused } from '@/src/pagePartials/errors/preventActionIfPaused'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

// Merge all in one schema
export const RegisterCuratorSchema = z
  .object({})
  .merge(RegisterCuratorSchemaStep1)
  .merge(RegisterCuratorSchemaStep2)
  .merge(RegisterCuratorSchemaStep3)

const Register: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()
  const router = useRouter()
  const { sendTx, state } = useTransaction()

  useEffect(() => {
    // Redirect to the creator profile section
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=${ProfileFilter.CREATED_BADGES}`)
    }
  }, [router, state])

  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const gql = useSubgraph()
  const userProfile = gql.useUserById({
    id: address || ethers.constants.AddressZero,
  })

  if (userProfile.data?.user?.isCreator) {
    router.push(`/profile?filter=${ProfileFilter.CREATED_BADGES}`)
  }

  async function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
    if (!address) {
      throw Error('Web3 address not provided')
    }
    const uploadedInfo = await ipfsUpload({
      attributes: {
        ...data,
      },
      filePaths: ['logo'],
    })

    try {
      const transaction = await sendTx(() =>
        theBadge.registerBadgeModelCreator(`ipfs://${uploadedInfo.result?.ipfsHash}`),
      )

      await transaction.wait()
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <PreventActionIfRegisterPaused>
      <RequiredConnection>
        <RegistrationSteps onSubmit={onSubmit} txState={state} />
      </RequiredConnection>
    </PreventActionIfRegisterPaused>
  )
}

export default withPageGenericSuspense(Register)
