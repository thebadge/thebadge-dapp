import React, { useCallback } from 'react'

import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts'
import { Button, ButtonProps } from '@mui/material'

import useTransaction from '@/src/hooks/useTransaction'

interface TxButtonProps extends ButtonProps {
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
  tx: () => Promise<ContractTransaction>
}

const TxButton: React.FC<TxButtonProps> = ({
  children,
  onFail,
  onMined,
  onSend,
  tx,
  ...restProps
}) => {
  const sendTx = useTransaction()

  const txHandler = useCallback(async () => {
    try {
      const transaction = await sendTx(tx)
      onSend && onSend(transaction)
      if (onMined) {
        const receipt = await transaction.wait()
        onMined(receipt)
      }
    } catch (error) {
      onFail && onFail(error)
    }
  }, [onFail, onMined, onSend, sendTx, tx])

  return (
    <Button onClick={txHandler} {...restProps}>
      {children}
    </Button>
  )
}

export default TxButton
