import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import useTBContract from '@/src/hooks/theBadge/useTBContract'
import useTransaction from '@/src/hooks/useTransaction'

type ClaimFunction = (badgeId: string) => Promise<void>

export default function useBadgeClaim(): ClaimFunction {
  const theBadge = useTBContract()
  const { sendTx } = useTransaction()
  const router = useRouter()

  return useCallback(
    async (badgeId: string) => {
      const transaction = await sendTx(() => theBadge.claim(badgeId, '0x'))
      if (transaction) {
        await transaction.wait()
        router.refresh()
      }
    },
    [sendTx, theBadge],
  )
}
