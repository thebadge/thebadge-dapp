import axios from 'axios'

import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import { EmailClaimTxSigned, RelayedTx, RelayedTxResult } from '@/types/relayedTx'
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
  param: EmailClaimTxSigned,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thirdPartyController/sendMintMail`,
    param,
  )
  return res.data
}

export const checkClaimUUIDValid = async (claimUUID: string): Promise<boolean> => {
  try {
    const res = await axios.get<BackendResponse<boolean>>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thirdPartyController/claim/valid/${claimUUID}`,
    )
    if (res.data.error || !res.data.result) {
      return false
    }
    return res.data.result
  } catch (error) {
    return false
  }
}

export const sendClaimRequest = async (
  claimUUID: string,
  claimAddress: string,
): Promise<RelayedTxResult> => {
  const res = await axios.post<BackendResponse<{ txHash: string }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thirdPartyController/claim`,
    { claimUUID, claimAddress },
  )
  if (res.data && res.data.result) {
    return {
      txHash: res.data.result.txHash,
      valid: true,
      errorMessage: res.data.message || '',
    }
  }
  return {
    txHash: ZERO_ADDRESS,
    valid: false,
    errorMessage: res.data.message || '',
  }
}

export const getEncryptedValues = async (
  networkId: string,
  data: Record<string, unknown>,
): Promise<string | null> => {
  const res = await axios.post<BackendResponse<{ payload: string }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thirdPartyController/encryptPayload`,
    { networkId, payload: data },
  )

  if (res.data.error || !res.data.result) {
    console.warn('The encryption errored with message: ', res.data.message)
    return null
  }

  return res.data.result.payload
}
