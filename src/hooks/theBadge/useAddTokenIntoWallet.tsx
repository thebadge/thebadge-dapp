import { useCallback } from 'react'

import { notify } from '@/src/components/toast/Toast'
import { isJsonRpcProvider, useEthersProvider } from '@/src/hooks/etherjs/useEthersProvider'
import useTBContract from '@/src/hooks/theBadge/useTBContract'
import { ToastStates } from '@/types/toast'

type AddTokenIntoWalletFn = (badgeId: string) => void

export default function useAddTokenIntoWallet() {
  const web3Provider = useEthersProvider()
  const theBadge = useTBContract()

  return useCallback<AddTokenIntoWalletFn>(
    async (badgeId: string) => {
      try {
        let wasAdded = false
        // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
        if (isJsonRpcProvider(web3Provider)) {
          wasAdded = await web3Provider?.send('wallet_watchAsset', {
            type: 'ERC1155',
            options: {
              address: theBadge.address,
              tokenId: badgeId,
            },
          } as unknown as any)
        } else {
          console.warn('FallbackProvider is not able to send methods')
        }

        if (wasAdded) {
          notify({ message: `Badge #${badgeId} added to metamask!`, type: ToastStates.success })
        } else {
          notify({
            message: `Badge ID #${badgeId} could not be added to metamask!`,
            type: ToastStates.info,
          })
        }
      } catch (error) {
        console.error(error)
        notify({
          message: `There was an error adding the badge #${badgeId} to metamask!`,
          type: ToastStates.infoFailed,
        })
      }
    },
    [theBadge.address, web3Provider],
  )
}
