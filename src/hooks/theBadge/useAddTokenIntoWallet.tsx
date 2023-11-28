import { useCallback } from 'react'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useWalletClient } from 'wagmi'

import { notify } from '@/src/components/toast/Toast'
import useTBContract from '@/src/hooks/theBadge/useTBContract'
import { ToastStates } from '@/types/toast'

type AddTokenIntoWalletFn = (badgeId: string, imageUrl?: string) => Promise<void>

export default function useAddTokenIntoWallet() {
  const { open: connectWallet } = useWeb3Modal()
  const { data: walletClient } = useWalletClient()

  const theBadge = useTBContract()

  return useCallback<AddTokenIntoWalletFn>(
    async (badgeId: string, imageUrl?: string) => {
      try {
        let wasAdded = false
        // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
        if (walletClient) {
          wasAdded = await walletClient.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC1155',
              options: {
                address: theBadge.address,
                tokenId: badgeId,
                image: imageUrl,
              },
            } as unknown as any,
          })
        } else {
          console.warn('Need to connect the wallet')
          connectWallet()
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
    [connectWallet, theBadge.address, walletClient],
  )
}
