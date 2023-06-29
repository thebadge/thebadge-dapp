import axios from 'axios'

import { RelayedTx } from '@/types/relayedTx'
import { BackendResponse } from '@/types/utils'

export default async function sendTxToRelayer(
  txToRelay: RelayedTx,
): Promise<BackendResponse<{ txHash: string | null }>> {
  const res = await axios.post<BackendResponse<{ txHash: string | null }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/relay/tx`,
    txToRelay,
  )
  return res.data
}
