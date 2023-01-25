import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { ethers } from 'ethers'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import { ImageSchema } from '@/src/components/form/helpers/customSchemas'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { TheBadge__factory } from '@/types/generated/typechain'

export const RegisterCuratorSchema = z.object({
  name: z.string().describe('Your name // ??'),
  description: z.string().describe('Tell us about you // Tell us about you'),
  logo: ImageSchema.describe('Your logo // Upload a logo that identifies you'), // Image Schema MUST BE the created one
  website: z.string().describe(`Website // ??`),
  twitter: z.string().describe(`Twitter // ??`),
  discord: z.string().describe(`Discord // ??`),
  email: z.string().describe(`Email // ??`),
})

const Register: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const router = useRouter()
  const sendTx = useTransaction()

  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })

  async function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
    if (!address) {
      throw Error('Web3 address not provided')
    }

    const { logo: image, ...rest } = data

    const uploadedInfo = await ipfsUpload({
      attributes: JSON.stringify(rest),
      files: [{ fileName: 'logo', mimeType: image.file.type, base64File: image.data_url }],
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

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Register as a creator
      </Typography>

      <Typography color={colors.white} variant="h5">
        Once registered as a creator you will be granted the possibility to created badge types.
      </Typography>

      <CustomFormFromSchema
        formProps={{
          buttonDisabled: !address,
          buttonLabel: address ? 'Register' : 'Connect wallet',
        }}
        onSubmit={onSubmit}
        schema={RegisterCuratorSchema}
      />
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
