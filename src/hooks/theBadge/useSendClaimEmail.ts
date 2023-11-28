import { useCallback } from 'react'

import { useSignMessage } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { sendEmailClaim } from '@/src/utils/relayTx'
import { EmailClaimTx } from '@/types/relayedTx'
import { ToastStates } from '@/types/toast'
import { BackendResponse } from '@/types/utils'

type Response = Promise<BackendResponse<{ txHash: string | null }>>

export default function useSendClaimEmail(): (props: EmailClaimTx) => Promise<Response> {
  const { signMessageAsync } = useSignMessage()
  const { address } = useWeb3Connection()

  return useCallback(
    async (props: EmailClaimTx): Promise<Response> => {
      const { badgeModelId, emailClaimer, mintTxHash, networkId } = props
      const signedMessage = `I accept the terms & conditions and I verify to be the owner of the address: ${address}`
      const signature = await signMessageAsync({
        message: signedMessage,
      })

      const result = await sendEmailClaim({
        networkId,
        mintTxHash,
        badgeModelId,
        emailClaimer,
        signature,
        signedMessage,
        ownerAddress: address as string,
      })

      if (result.error) {
        notify({
          id: mintTxHash,
          type: ToastStates.infoFailed,
          message: result.message,
          position: 'bottom-right',
        })
      } else {
        notify({
          id: mintTxHash,
          type: ToastStates.info,
          message: result.message,
          position: 'bottom-right',
        })
      }

      return result
    },
    [address, signMessageAsync],
  )
}
