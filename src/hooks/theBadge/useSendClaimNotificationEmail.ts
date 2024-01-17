import { useCallback, useState } from 'react'

import { useSignMessage } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { sendEmailClaim } from '@/src/utils/relayTx'
import { EmailClaimTx } from '@/types/relayedTx'
import { ToastStates } from '@/types/toast'

const SIGNED_MESSAGE = (address: `0x${string}` | undefined) =>
  `I accept the terms & conditions and I verify to be the owner of the address: ${address}`

export default function useSendClaimNotificationEmail() {
  const { signMessageAsync } = useSignMessage()
  const { address } = useWeb3Connection()

  const [preSignature, setPreSignature] = useState<string | undefined>(undefined)
  const [emailParams, setEmailParams] = useState<Omit<EmailClaimTx, 'mintTxHash'> | undefined>(
    undefined,
  )

  const prepareClaimNotificationEmailWithSignature = useCallback(async () => {
    const signature = await signMessageAsync({
      message: SIGNED_MESSAGE(address),
    })
    setPreSignature(signature)
    return signature
  }, [address, signMessageAsync])

  const prepareClaimNotificationEmailConfigs = useCallback(
    (props: Omit<EmailClaimTx, 'mintTxHash'>) => {
      setEmailParams(props)
    },
    [],
  )

  const sendClaimNotificationEmail = useCallback(
    async (
      mintTxHash: string,
      options?: Omit<EmailClaimTx, 'mintTxHash'> & { emailMessageSignature?: string },
    ) => {
      let signature = ''
      if (!preSignature && !options?.emailMessageSignature) {
        signature = await prepareClaimNotificationEmailWithSignature()
      } else {
        // It will have one or the other
        signature = (preSignature || options?.emailMessageSignature) as string
      }

      if (emailParams || options) {
        const params = { ...emailParams, ...options } as Omit<EmailClaimTx, 'mintTxHash'>
        try {
          const result = await sendEmailClaim({
            ...params,
            mintTxHash,
            signature,
            signedMessage: SIGNED_MESSAGE(address),
            ownerAddress: address as string,
          })

          notify({
            id: mintTxHash,
            type: ToastStates.info,
            message: result.message,
            position: 'bottom-right',
          })

          return result
        } catch (e: any) {
          notify({
            id: mintTxHash,
            type: ToastStates.infoFailed,
            title: 'Claim email failed',
            message:
              'Fail to send email to the user to claim. You can do a resend at any time through your profile, in the management tab.',
            position: 'bottom-right',
          })
        }
      } else {
        throw 'You must provide emails parameters before send it. You may miss the call prepareSendConfigs()'
      }
    },
    [address, emailParams, preSignature, prepareClaimNotificationEmailWithSignature],
  )

  return {
    prepareClaimNotificationEmailWithSignature,
    prepareClaimNotificationEmailConfigs,
    sendClaimNotificationEmail,
  }
}
