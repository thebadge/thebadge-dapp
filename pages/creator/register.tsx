import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Stack, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { colors } from 'thebadge-ui-library'
import { ZodObject, z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import {
  AvatarSchema,
  CheckBoxSchema,
  EmailSchema,
  LongTextSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import RegistrationSteps from '@/src/pagePartials/creator/register/RegistrationSteps'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { TheBadge__factory } from '@/types/generated/typechain'

export const RegisterCuratorSchemaStep1 = z.object({
  name: z.string().describe('Your name // ??'),
  description: LongTextSchema.describe(
    'Description // Tell us about you, share some of you background with the community.',
  ),
  logo: AvatarSchema.describe('Profile photo // Upload a photo that identifies you.'), // Image Schema MUST BE the created one
})

export const RegisterCuratorSchemaStep2 = z.object({
  website: z.string().describe(`Website // ??`).optional(),
  twitter: TwitterSchema.describe(`Twitter // ??`).optional(),
  discord: z.string().describe(`Discord // ??`).optional(),
  email: EmailSchema.describe(`Email // ??`),
})

export const RegisterCuratorSchemaStep3 = z.object({
  terms: CheckBoxSchema.describe(`Terms & Conditions // ??`),
})

const Register: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const router = useRouter()
  const sendTx = useTransaction()

  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })

  async function onSubmit(data: ZodObject<any>[]) {
    const [step1, step2, step3] = data
    // This is not the best way to do it, but is the only one that came to my mind now.
    const typedStep1 = step1 as unknown as z.infer<typeof RegisterCuratorSchemaStep1>
    const typedStep2 = step2 as unknown as z.infer<typeof RegisterCuratorSchemaStep2>
    const typedStep3 = step3 as unknown as z.infer<typeof RegisterCuratorSchemaStep3>

    if (!address) {
      throw Error('Web3 address not provided')
    }

    const typedStepAux = { ...typedStep1 }
    typedStepAux.logo = {
      mimeType: typedStep1.logo.file.type,
      base64File: typedStep1.logo.data_url,
    }

    const uploadedInfo = await ipfsUpload({
      attributes: JSON.stringify({ ...typedStepAux, ...typedStep2, ...typedStep3 }),
      files: ['logo'],
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
      <Stack sx={{ mb: 2 }}>
        <Typography color={colors.white} variant="h3">
          Register as a creator
        </Typography>
        <Typography color={colors.white} variant="h5">
          Once registered as a creator you will be granted the possibility to created badge types.
        </Typography>
      </Stack>
      <RegistrationSteps
        onSubmit={onSubmit}
        stepSchemas={[
          RegisterCuratorSchemaStep1,
          RegisterCuratorSchemaStep2,
          RegisterCuratorSchemaStep3,
        ]}
      />
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
