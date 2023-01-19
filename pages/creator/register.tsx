import { ReactElement, useReducer } from 'react'

import { Typography, styled } from '@mui/material'
import { ethers } from 'ethers'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import TxButton from '@/src/components/buttons/txButton'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { TheBadge__factory } from '@/types/generated/typechain'

// TODO Delete and use the dynamic one
const Form = styled('form')`
  width: 100%;
`

export type FormData = {
  hash: string
}

const Register: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const [formData, setFormData] = useReducer(
    (data: FormData, partialData: Partial<FormData>) => ({ ...data, ...partialData }),
    {
      hash: 'ipfs://QmWLoY3L55vmFpPZegBCMi3wx3fxpyzhQAfuvXSYtQ7gne', // redbull file
    },
  )

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })

  if (creatorByAddress.data?.emitter) {
    // TODO Improve creator already registered workflow
    return (
      <div>
        <div>Connected address is already an emitter</div>
        <div>Address: {creatorByAddress.data.emitter.id}</div>
        <div>Metadata: {creatorByAddress.data.emitter.metadata}</div>
      </div>
    )
  }

  if (!address) {
    // TODO Improve not connected wallet workflow
    return (
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>
    )
  }

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Please fulfill the form
      </Typography>

      <Form>
        {/* <Label>Name</Label>
      <Row>
        <Textfield onChange={(event) => setFormData({ namwe: event.target.value })} />
      </Row>

      <Label>Description</Label>
      <Row>
        <Textfield onChange={(event) => setFormData({ description: event.target.value })} />
      </Row> */}

        {/* <Formfield
        formControl={
          <Textfield
            onChange={(event) => setFormData({ hash: event.target.value })}
            value={formData.hash}
          />
        }
        label="IPFS Hash"
      /> */}

        <TxButton
          disabled={false}
          onSend={(tx) => tx && setFormData({ hash: '' })}
          tx={() => theBadge.registerEmitter(address, formData.hash)}
        >
          Register
        </TxButton>
      </Form>
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
