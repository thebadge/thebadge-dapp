import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadge, TheBadge__factory } from '@/types/generated/typechain'

export default function useTBContract(): TheBadge {
  return useContractInstance(TheBadge__factory, 'TheBadge')
}
