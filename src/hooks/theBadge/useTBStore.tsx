import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadgeStore, TheBadgeStore__factory } from '@/types/generated/typechain'

export default function useTBStore(): TheBadgeStore {
  return useContractInstance(TheBadgeStore__factory, 'TheBadgeStore')
}
