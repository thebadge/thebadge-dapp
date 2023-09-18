import { UserInfo } from '@web3auth/base'

import { ChainsValues } from '@/types/chains'

export enum SupportedRelayMethods {
  MINT = 'mint',
  IS_ASSET_ACTIVE = 'isAssetActive',
}

export interface RelayedTx {
  data: string // String json of the method params

  from: string

  chainId: string

  method: SupportedRelayMethods

  signature: string

  appPubKey: string

  userAccount: {
    userSocialInfo: Partial<UserInfo>
    address: string
  }
}

export interface EmailClaimTx {
  networkId: string

  mintTxHash: string

  badgeId: number

  badgeModelId: number

  emailClaimer: string
}
