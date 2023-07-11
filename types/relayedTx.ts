import { UserInfo } from '@web3auth/base'

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

  userAccount: {
    userSocialInfo: Partial<UserInfo>
    address: string
  }
}
