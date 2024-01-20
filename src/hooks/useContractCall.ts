import { BaseContract } from '@ethersproject/contracts'
import useSWR, { SWRConfiguration } from 'swr'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import getCacheKey from '@/src/utils/cacheKey'
import { MySWRResponse, TupleParametersType, TupleReturnType, Writeable } from '@/types/utils'

export function useContractCall<
  MyContract extends BaseContract,
  Calls extends Readonly<MyContract['functions'][string][]>,
>(
  calls: Readonly<Calls>,
  params: TupleParametersType<MyContract, Writeable<Calls>>,
  key: string,
  options?: SWRConfiguration,
): MySWRResponse<TupleReturnType<MyContract, Writeable<Calls>>> {
  const { appChainId } = useWeb3Connection()
  const {
    data = [],
    error,
    mutate: refetch,
  } = useSWR(
    [getCacheKey([...params, key, appChainId || 0])],
    async () => {
      try {
        // eslint-disable-next-line prefer-spread
        return Promise.all(calls.map((c, i) => c.apply(null, params[i])))
      } catch (e) {
        console.log({ error: e })
      }
    },
    options,
  )

  return [
    error ? { data: null, error } : { data, error: null },
    refetch,
  ] as unknown as MySWRResponse<TupleReturnType<MyContract, Writeable<Calls>>>
}
