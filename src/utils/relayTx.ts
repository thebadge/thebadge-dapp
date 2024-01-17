import axios from 'axios'

import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import { BACKEND_URL } from '@/src/constants/common'
import {
  EmailClaimTxSigned,
  EmailMintNotificationTxSigned,
  RelayedTx,
  RelayedTxResult,
} from '@/types/relayedTx'
import { BackendResponse } from '@/types/utils'

export const sendTxToRelayer = async (
  txToRelay: RelayedTx,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${BACKEND_URL}/api/relay/tx`,
    txToRelay,
  )
  return res.data
}

// TODO This should be removed and this method should be directly inside the relayer, we just need to ask the relayer to relay the  tx
export const sendEmailClaim = async (
  param: EmailClaimTxSigned,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  // const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
  //   `${BACKEND_URL}/api/thirdPartyController/sendMintMail`,
  //   param,
  // )
  return fetch(`${BACKEND_URL}/api/thirdPartyController/sendMintMail`, {
    method: 'POST',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param), // body data type must match "Content-Type" header
  }).then((r) => r.json())
}

export const sendMintNotificationEmail = async (
  param: EmailMintNotificationTxSigned,
): Promise<BackendResponse<{ txHash: string | null }>> => {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${BACKEND_URL}/api/thirdPartyController/sendMintNotificationMail`,
    param,
  )
  return res.data
}

export const sendDecryptEmailRequest = async (
  param: EmailClaimTxSigned,
): Promise<BackendResponse<{ email: string | null }>> => {
  const res = await axios.post<BackendResponse<{ email: string | null }>>(
    `${BACKEND_URL}/api/thirdPartyController/decryptMintEmail`,
    param,
  )
  return res.data
}

export const checkClaimUUIDValid = async (claimUUID: string): Promise<boolean> => {
  try {
    const res = await axios.get<BackendResponse<boolean>>(
      `${BACKEND_URL}/api/thirdPartyController/claim/valid/${claimUUID}`,
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
    `${BACKEND_URL}/api/thirdPartyController/claim`,
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
    `${BACKEND_URL}/api/thirdPartyController/encryptPayload`,
    { networkId, payload: data },
  )

  if (res.data.error || !res.data.result) {
    console.warn('The encryption errored with message: ', res.data.message)
    return null
  }

  return res.data.result.payload
}
