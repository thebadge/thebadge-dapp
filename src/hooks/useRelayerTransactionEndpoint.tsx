import { useCallback, useState } from 'react'

import { TransactionStates } from './useTransaction'
import { useTransactionNotification } from '@/src/providers/TransactionNotificationProvider'
import { TransactionError } from '@/src/utils/TransactionError'
import { RelayMethod } from '@/types/relayedTx'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function useRelayerTransactionEndpoint() {
  const { readOnlyAppProvider } = useWeb3Connection()
  const [state, setTransactionState] = useState(TransactionStates.none)
  const { notifyTxMined, notifyWaitingForTxMined } = useTransactionNotification()

  const resetTxState = useCallback(() => {
    setTransactionState(TransactionStates.none)
  }, [])

  const waitForAsyncTxExecution = useCallback(
    (txHash: string) => {
      notifyWaitingForTxMined(txHash)
      setTransactionState(TransactionStates.waitingMined)
      readOnlyAppProvider
        ?.waitForTransaction(txHash)
        .then((r) => {
          notifyTxMined(r.transactionHash, true)
          setTransactionState(TransactionStates.success)
        })
        .catch((e) => {
          const error = new TransactionError(
            e.data?.message || e.message || 'Unable to decode revert reason',
            e.data?.code || e.code,
            e.data,
          )
          console.error(error)
          setTransactionState(TransactionStates.failed)
          notifyTxMined(txHash)
        })
    },
    [notifyTxMined, notifyWaitingForTxMined, readOnlyAppProvider],
  )

  const sendRequest = useCallback(
    async (requestedMethod: RelayMethod) => {
      try {
        setTransactionState(TransactionStates.waitingExecution)
        const { errorMessage, txHash, valid } = await requestedMethod()
        if (!valid || !txHash) {
          throw new Error(errorMessage)
        }
        await waitForAsyncTxExecution(txHash)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        console.error(error)
        setTransactionState(TransactionStates.failed)
      }
    },
    [waitForAsyncTxExecution],
  )

  return { state, resetTxState, sendRequest, setTransactionState }
}
