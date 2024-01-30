import { useCallback, useState } from 'react'

import { ContractTransaction } from '@ethersproject/contracts'

import { useEthersProvider } from '@/src/hooks/etherjs/useEthersProvider'
import { useTransactionNotification } from '@/src/providers/TransactionNotificationProvider'
import { TransactionError } from '@/src/utils/TransactionError'
import { sendTxToRelayer } from '@/src/utils/relayTx'
import { RelayedTx } from '@/types/relayedTx'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export enum TransactionStates {
  none = 'NONE',
  failed = 'FAILED',
  success = 'SUCCESS',
  waitingSignature = 'WAITING-SIGNATURE',
  waitingExecution = 'WAITING-EXECUTION',
  waitingMined = 'WAITING-MINED',
}

export default function useTransaction() {
  const { isAppConnected } = useWeb3Connection()
  const web3Provider = useEthersProvider()
  const [state, setTransactionState] = useState(TransactionStates.none)
  const {
    notifyRejectSignature,
    notifyTxMined,
    notifyWaitingForSignature,
    notifyWaitingForTxMined,
  } = useTransactionNotification()

  const resetTxState = useCallback(() => {
    setTransactionState(TransactionStates.none)
  }, [])

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

  const waitForAsyncTxExecution = useCallback(
    (txHash: string) => {
      notifyWaitingForTxMined(txHash)
      setTransactionState(TransactionStates.waitingMined)
      web3Provider
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
    [notifyTxMined, notifyWaitingForTxMined, web3Provider],
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
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        console.error(error)
        setTransactionState(TransactionStates.failed)
        notifyRejectSignature(error.code === 4001 ? 'User denied signature' : error.message)
      }
    },
    [isAppConnected, notifyWaitingForSignature, waitForTxExecution, notifyRejectSignature],
  )

  const sendRelayTx = useCallback(
    async (populatedTx: RelayedTx) => {
      if (!isAppConnected) {
        throw Error('App is not connected')
      }
      try {
        notifyWaitingForSignature()
        setTransactionState(TransactionStates.waitingSignature)
        const { appPubKey, chainId, data, from, method, signature, userAccount } = populatedTx
        const { error, message, result } = await sendTxToRelayer({
          data,
          from,
          chainId,
          method,
          signature,
          userAccount,
          appPubKey,
        })
        if (error || !result) {
          throw new Error(message)
        }
        if (result.txHash) {
          await waitForAsyncTxExecution(result.txHash)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )
        console.error(error)
        setTransactionState(TransactionStates.failed)
        notifyRejectSignature(error.code === 4001 ? 'User denied signature' : error.message)
      }
    },
    [isAppConnected, notifyWaitingForSignature, waitForAsyncTxExecution, notifyRejectSignature],
  )

  return { state, sendTx, sendRelayTx, resetTxState }
}
