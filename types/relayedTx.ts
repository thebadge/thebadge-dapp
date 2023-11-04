import { UserInfo } from '@web3auth/base'

export enum SupportedRelayMethods {
  MINT = 'mint',
  MINT_ALEO = 'mintAleo',
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

  isSocialLogin: boolean
}

export interface EmailClaimTx {
  networkId: string

  mintTxHash: string

  badgeModelId: number

  emailClaimer: string
}

export interface RelayedTxResult {
  txHash: string | null
  valid: boolean
  errorMessage: string
}

export interface RelayMethod {
  (): Promise<RelayedTxResult>
}
