import { useCallback, useState } from 'react'

import { useSignMessage } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
import { sendMintEmail } from '@/src/utils/relayTx'
import { EmailClaimTx, EmailMintNotificationTx } from '@/types/relayedTx'
import { ToastStates } from '@/types/toast'
import { BackendResponse } from '@/types/utils'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

type PrepareSignatureFnType = () => Promise<`0x${string}`>
type PrepareConfigsFnType = (p: Omit<EmailMintNotificationTx, 'mintTxHash'>) => void
type SendFnType = (
  mintTxHash: string,
  options?: Omit<EmailMintNotificationTx, 'mintTxHash'> & { emailMessageSignature?: string },
) => Promise<BackendResponse<{ txHash: string | null }> | undefined>

const SIGNED_MESSAGE = (address: `0x${string}` | undefined) =>
  `I accept the terms & conditions and I verify to be the owner of the address: ${address}`

export default function useSendMintNotificationEmail() {
  const { signMessageAsync } = useSignMessage()
  const { address } = useWeb3Connection()

  const [preSignature, setPreSignature] = useState<string | undefined>(undefined)
  const [emailParams, setEmailParams] = useState<Omit<EmailClaimTx, 'mintTxHash'> | undefined>(
    undefined,
  )

  const prepareMintNotificationEmailWithSignature =
    useCallback<PrepareSignatureFnType>(async () => {
      const signature = await signMessageAsync({
        message: SIGNED_MESSAGE(address),
      })
      setPreSignature(signature)
      return signature
    }, [address, signMessageAsync])

  const prepareMintNotificationEmailConfigs = useCallback<PrepareConfigsFnType>((props) => {
    setEmailParams(props)
  }, [])

  const sendMintNotificationEmail = useCallback<SendFnType>(
    async (mintTxHash, options) => {
      let signature = ''
      if (!preSignature && !options?.emailMessageSignature) {
        signature = await prepareMintNotificationEmailWithSignature()
      } else {
        // It will have one or the other
        signature = (preSignature || options?.emailMessageSignature) as string
      }

      if (emailParams || options) {
        const params = { ...emailParams, ...options } as Omit<EmailMintNotificationTx, 'mintTxHash'>
        try {
          const result = await sendMintEmail({
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
            title: 'Notification email failed',
            message:
              'Fail to send the notification email. You can do a resend at any time through your profile, in the management tab.',
            position: 'bottom-right',
          })
        }
      } else {
        throw 'You must provide emails parameters before send it. You may miss the call prepareSendConfigs()'
      }
    },
    [address, emailParams, preSignature, prepareMintNotificationEmailWithSignature],
  )

  return {
    prepareMintNotificationEmailWithSignature,
    prepareMintNotificationEmailConfigs,
    sendMintNotificationEmail,
  }
}
