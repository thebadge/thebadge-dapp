import { isAddress } from 'ethers/lib/utils'

export default function isSameAddress(address1?: string, address2?: string) {
  if (!address1 || !address2) return false
  if (isAddress(address1) && isAddress(address2)) {
    return address1.toUpperCase() === address2.toUpperCase()
  } else return false
}
