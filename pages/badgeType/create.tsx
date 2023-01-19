import { useReducer } from 'react'
import styled from 'styled-components'

import { constants, ethers } from 'ethers'
import { AbiCoder, defaultAbiCoder, parseUnits } from 'ethers/lib/utils'

import TxButton from '@/src/components/buttons/txButton'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateKlerosListMetaEvidence } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { KLEROS_LIST_TYPES } from '@/src/utils/kleros/types'
import { TheBadge__factory } from '@/types/generated/typechain'

const Form = styled.form`
  width: 100%;
`

export type FormData = {
  hash: string
}

export default function RegisterEmitterForm() {
  const { address } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  if (!address) {
    return 'Not connected'
  }

  // const { clearing, registration } = generateKlerosListMetaEvidence(
  //   'Github', // itemName: string,
  //   'Github', // itemNamePlural: string,
  //   'ipfs://QmXTYGaV23KCGN4PxP6R9GvTsyU4gi9X2ymarL2M1k1vju', // criteriaFileUri, this file is used to describe the requirements to mint a badge
  //   'Github', //listName: string,
  //   'Github badge types allows a Github user to claim ownership of a Github account', //listDescription: string,
  //   [
  //     {
  //       label: 'Github account',
  //       description: 'Enter your Github account',
  //       type: KLEROS_LIST_TYPES.TEXT,
  //       isIdentifier: true,
  //     },
  //   ], // listItemInfo: MetadataColumn[],
  //   'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', // listLogoUri: string, upload logo provided to the user to IPFS and use that hash
  //   true, // requireRemovalEvidence: boolean,
  //   true, // wrelTcrDisabled: boolean, // research about it
  // )

  // console.log(JSON.stringify(registration))

  return (
    <Form>
      <TxButton
        tx={() => {
          const klerosControllerDataEncoded = defaultAbiCoder.encode(
            [
              `tuple(
                address,
                address,
                uint256,
                uint256,
                string,
                string,
                uint256,
                uint256[4],
                uint256[3]
              )`,
            ],
            [
              [
                address as string, // governor
                constants.AddressZero, // admin
                0, // courtId:
                1, // numberOfJurors:
                'ipfs://QmXTYGaV23KCGN4PxP6R9GvTsyU4gi9X2ymarL2M1k1vju2', // upload registration file to IPFS and use the hash
                'ipfs://QmXTYGaV23KCGN4PxP6R9GvTsyU4gi9X2ymarL2M1k1vju', // upload clearing file to IPFS and use the hash
                10, // challengePeriodDuration:
                [
                  0,
                  parseUnits('0.01', 18).toString(),
                  parseUnits('0.01', 18).toString(),
                  parseUnits('0.01', 18).toString(),
                ], // baseDeposits:
                [100, 100, 100], // stakeMultipliers:
              ],
            ],
          )

          return theBadge.createBadgeType(
            {
              metadata: 'ipfs://QmZrfVxGCo3L6qUeg7C1RXqCRDrzMkMeDNXUcBg9Yxrtaa',
              controllerName: 'kleros',
              mintCost: parseUnits('0.1', 18),
              mintFee: parseUnits('0.1', 18),
              validFor: 0, // in seconds, 0 infinite
            },
            klerosControllerDataEncoded,
          )
        }}
      >
        Create badge-type
      </TxButton>
    </Form>
  )
}
