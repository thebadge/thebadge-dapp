import { useCallback } from 'react'

import { useSignMessage } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { sendMintNotificationEmail } from '@/src/utils/relayTx'
import { EmailMintNotificationTx } from '@/types/relayedTx'
import { ToastStates } from '@/types/toast'
import { BackendResponse } from '@/types/utils'

type Response = Promise<BackendResponse<{ txHash: string | null }>>

export default function useSendMintNotificationEmail(): (
  props: EmailMintNotificationTx,
) => Promise<Response> {
  const { signMessageAsync } = useSignMessage()
  const { address } = useWeb3Connection()

  return useCallback(
    async (props: EmailMintNotificationTx): Promise<Response> => {
      const { badgeModelId, emailRecipient, mintTxHash, networkId } = props
      const signedMessage = `I accept the terms & conditions and I verify to be the owner of the address: ${address}`
      const signature = await signMessageAsync({
        message: signedMessage,
      })

      const result = await sendMintNotificationEmail({
        networkId,
        mintTxHash,
        badgeModelId,
        emailRecipient,
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
