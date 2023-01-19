import { useReducer } from 'react'
import styled from 'styled-components'

import { ethers } from 'ethers'

import TxButton from '@/src/components/buttons/txButton'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { TheBadge__factory } from '@/types/generated/typechain'

// import { Formfield } from '@/src/components/form/Formfield'
// import { Textfield } from '@/src/components/form/Textfield'

const Form = styled.form`
  width: 100%;
`

export type FormData = {
  hash: string
}

export default function RegisterEmitterForm() {
  const { address, appChainId } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const [formData, setFormData] = useReducer(
    (data: FormData, partialData: Partial<FormData>) => ({ ...data, ...partialData }),
    {
      hash: 'ipfs://QmWLoY3L55vmFpPZegBCMi3wx3fxpyzhQAfuvXSYtQ7gne', // redbull file
    },
  )

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const emitterByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })

  if (!address) {
    return 'Not connected'
  }

  if (emitterByAddress.data?.emitter) {
    return (
      <div>
        <div>Connected address is already an emitter</div>
        <div>Address: {emitterByAddress.data.emitter.id}</div>
        <div>Metadata: {emitterByAddress.data.emitter.metadata}</div>
      </div>
    )
  }

  return (
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
  )
}
