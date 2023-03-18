import { useRouter } from 'next/router'

import { Stack, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
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
import { NextPageWithLayout } from '@/types/next'

// Merge all in one schema
export const RegisterCuratorSchema = z
  .object({})
  .merge(RegisterCuratorSchemaStep1)
  .merge(RegisterCuratorSchemaStep2)
  .merge(RegisterCuratorSchemaStep3)

const Register: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address, appChainId, isWalletConnected } = useWeb3Connection()
  const router = useRouter()
  const { sendTx } = useTransaction()

  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userProfile = gql.useUserById({
    id: address || ethers.constants.AddressZero,
  })

  async function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
    if (!address) {
      throw Error('Web3 address not provided')
    }
    const uploadedInfo = await ipfsUpload({
      attributes: {
        ...data,
        logo: { mimeType: data.logo?.file.type, base64File: data.logo?.data_url },
      },
      filePaths: ['logo'],
    })

    const transaction = await sendTx(() =>
      theBadge.registerEmitter(address, `ipfs://${uploadedInfo.result?.ipfsHash}`),
    )

    await transaction.wait()

    router.push('/creator/profile')
  }

  if (userProfile.data?.user?.isCreator) {
    router.push('/creator/profile')
  }

  if (!isWalletConnected) {
    return <Typography>Please connect your wallet to continue</Typography>
  }

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.purple} textAlign="center" variant="title2">
          {t('creator.register.title')}
        </Typography>

        <Typography textAlign="justify" variant="body4" width="85%">
          {t('creator.register.sub-title')}
        </Typography>
      </Stack>
      <RegistrationSteps onSubmit={onSubmit} />
    </>
  )
}

export default withPageGenericSuspense(Register)
