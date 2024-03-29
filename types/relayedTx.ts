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

  appPubKey: string

  userAccount: {
    userSocialInfo: Partial<UserInfo>
    address: string
  }
}

export interface EmailClaimTx {
  networkId: string

  mintTxHash: string

  badgeModelId: number

  emailClaimer?: string
}

export interface EmailMintNotificationTx {
  networkId: string

  mintTxHash: string

  badgeModelId: number

  emailRecipient: string
}

export type EmailClaimTxSigned = EmailClaimTx & {
  signature: string

  signedMessage: string

  ownerAddress: string
}

export type EmailMintNotificationTxSigned = EmailMintNotificationTx & {
  signature: string

  signedMessage: string

  ownerAddress: string
}

export interface RelayedTxResult {
  txHash: string | null
  valid: boolean
  errorMessage: string
}

export interface RelayMethod {
  (): Promise<RelayedTxResult>
}
