import { BigNumberish } from 'ethers'
import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { Kleros__factory } from '@/types/generated/typechain'

/**
 * This hook check the Juror fee on the Kleros contract, based on a court id
 * @param courtId
 */
export function useJurorFee(courtId: BigNumberish) {
  const kleros = useContractInstance(Kleros__factory, 'Kleros')

  return useSWR(
    [`feeForJuror:${courtId}`, courtId],
    async ([,]) => {
      const court = await kleros.courts(courtId)
      return court.feeForJuror
    },
    { revalidateOnMount: true },
  )
}
