import { JsonRpcProvider } from '@ethersproject/providers'
import axios from 'axios'
import { ethers } from 'ethers'

import { EmailClaimTx, RelayedTx } from '@/types/relayedTx'
import { BackendResponse } from '@/types/utils'

export const sendTxToRelayer = async (
  txToRelay: RelayedTx,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/relay/tx`,
    txToRelay,
  )
  return res.data
}

// TODO This should be removed and this method should be directly inside the relayer, we just need to ask the relayer to relay the  tx
export const sendEmailClaim = async (
  param: EmailClaimTx,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thirdPartyController/sendMintMail`,
    param,
  )
  return res.data
}

// TODO: This should be moved to the relayer
export const getBadgeIdFromTxHash = async (
  txHash: string,
  readOnlyAppProvider: JsonRpcProvider,
): Promise<number> => {
  let badgeId: number | null = null

  try {
    const { logs } = await readOnlyAppProvider.getTransactionReceipt(txHash)

    // Event signature for the "TransferSingle" event
    const transferSingleEventSignature = 'TransferSingle(address,address,address,uint256,uint256)'

    const transferEncodedSignature = ethers.utils.id(transferSingleEventSignature)
    // Parse logs for the "TransferSingle" event
    logs.forEach((log) => {
      try {
        const eventSignature = log.topics[0]
        if (eventSignature.toLowerCase() === transferEncodedSignature.toLowerCase()) {
          // Extract the NFT ID from the log data (assuming it's a uint256)
          const nftId = BigInt(log.data)
          badgeId = Number(nftId.toString())
          return nftId
        }
      } catch (error) {}
    })
  } catch (error: unknown) {
    console.error('Error reading logs:', error)
    throw new Error('No transfer event found!')
  }
  if (!badgeId) {
    throw new Error('No badgeId found!')
  }
  return badgeId as number
}
