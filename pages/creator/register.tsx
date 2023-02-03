import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Stack, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import RegistrationSteps, {
  RegisterCuratorSchemaStep1,
  RegisterCuratorSchemaStep2,
  RegisterCuratorSchemaStep3,
} from '@/src/pagePartials/creator/register/RegistrationSteps'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { TheBadge__factory } from '@/types/generated/typechain'

// Merge all in one schema
export const RegisterCuratorSchema = z
  .object({})
  .merge(RegisterCuratorSchemaStep1)
  .merge(RegisterCuratorSchemaStep2)
  .merge(RegisterCuratorSchemaStep3)

const Register: NextPageWithLayout = () => {
  const { address, appChainId, isWalletConnected } = useWeb3Connection()
  const router = useRouter()
  const sendTx = useTransaction()

  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })

  async function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
    if (!address) {
      throw Error('Web3 address not provided')
    }
    const uploadedInfo = await ipfsUpload({
      attributes: JSON.stringify(data),
      filePaths: ['logo'],
    })

    const transaction = await sendTx(() =>
      theBadge.registerEmitter(address, `ipfs://${uploadedInfo.result?.ipfsHash}`),
    )

    await transaction.wait()

    router.push('/creator/profile')
  }

  if (creatorByAddress.data?.emitter) {
    router.push('/creator/profile')
  }

  if (!isWalletConnected) {
    return <Typography>Please connect your wallet to continue</Typography>
  }

  return (
    <>
      <Stack sx={{ mb: 2 }}>
        <Typography color={colors.white} variant="h3">
          Register as a creator
        </Typography>
        <Typography color={colors.white} variant="h5">
          Once registered as a creator you will be granted the possibility to created badge types.
        </Typography>
      </Stack>
      <RegistrationSteps onSubmit={onSubmit} />
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
