import { useCallback } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { TheBadge__factory } from '@/types/generated/typechain'

type ClaimFunction = (badgeId: string) => Promise<void>

export default function useBadgeClaim(): ClaimFunction {
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const { sendTx } = useTransaction()

  return useCallback(
    async (badgeId: string) => {
      const transaction = await sendTx(() => theBadge.claim(badgeId, '0x'))
      if (transaction) {
        await transaction.wait()
      }
    },
    [sendTx, theBadge],
  )
}
