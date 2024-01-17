import { useCallback } from 'react'

import { useSignMessage } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { sendMintNotificationEmail } from '@/src/utils/relayTx'
import { EmailMintNotificationTx } from '@/types/relayedTx'
import { ToastStates } from '@/types/toast'

export default function useSendMintNotificationEmail() {
  const { signMessageAsync } = useSignMessage()
  const { address } = useWeb3Connection()

  return useCallback(
    async (props: EmailMintNotificationTx) => {
      const { badgeModelId, emailRecipient, mintTxHash, networkId } = props
      const signedMessage = `I accept the terms & conditions and I verify to be the owner of the address: ${address}`
      const signature = await signMessageAsync({
        message: signedMessage,
      })

      try {
        const result = await sendMintNotificationEmail({
          networkId,
          mintTxHash,
          badgeModelId,
          emailRecipient,
          signature,
          signedMessage,
          ownerAddress: address as string,
        })

        notify({
          id: mintTxHash,
          type: ToastStates.info,
          message: result.message,
          position: 'bottom-right',
        })
        return result
      } catch (e) {
        notify({
          id: mintTxHash,
          type: ToastStates.infoFailed,
          title: 'Notification email failed',
          message:
            'Fail to send the notification email. You can do a resend at any time through your profile, in the management tab.',
          position: 'bottom-right',
        })
      }
    },
    [address, signMessageAsync],
  )
}
