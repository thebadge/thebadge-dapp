import { useCallback, useState } from 'react'

import { ContractTransaction } from '@ethersproject/contracts'

import { useTransactionNotification } from '@/src/providers/TransactionNotificationProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TransactionError } from '@/src/utils/TransactionError'

export enum TransactionStates {
  none = 'NONE',
  failed = 'FAILED',
  success = 'SUCCESS',
  waitingSignature = 'WAITING-SIGNATURE',
  waitingMined = 'WAITING-MINED',
}

export default function useTransaction() {
  const { isAppConnected } = useWeb3Connection()
  const [state, setTransactionState] = useState(TransactionStates.none)
  const {
    notifyRejectSignature,
    notifyTxMined,
    notifyWaitingForSignature,
    notifyWaitingForTxMined,
  } = useTransactionNotification()

  const waitForTxExecution = useCallback(
    (tx: ContractTransaction) => {
      notifyWaitingForTxMined(tx.hash)
      setTransactionState(TransactionStates.waitingMined)
      tx.wait()
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
          notifyTxMined(tx.hash)
        })
    },
    [notifyTxMined, notifyWaitingForTxMined],
  )

  const sendTx = useCallback(
    async (methodToCall: () => Promise<ContractTransaction>) => {
      if (!isAppConnected) {
        throw Error('App is not connected')
      }
      try {
        notifyWaitingForSignature()
        setTransactionState(TransactionStates.waitingSignature)
        const receipt = await methodToCall()
        if (receipt) waitForTxExecution(receipt)
        return receipt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setTransactionState(TransactionStates.failed)
        console.error(e)
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )

        notifyRejectSignature(error.code === 4001 ? 'User denied signature' : error.message)
        throw error
      }
    },
    [isAppConnected, notifyWaitingForSignature, waitForTxExecution, notifyRejectSignature],
  )
  return { state, sendTx }
}
