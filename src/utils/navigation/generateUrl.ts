import _ from 'lodash'

import { Chains, getChainName } from '@/src/config/web3'
import { LINKEDIN_URL } from '@/src/constants/common'
import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { ChainsValues } from '@/types/chains'

export function generateMintUrl(
  controllerType: string,
  badgeModelId: string = BadgeModelControllerType.Community,
) {
  return `/badgeModel/${controllerType}/${badgeModelId}/mint`
}

export function generateModelExplorerUrl(
  badgeModelId: string,
  controllerType: string = BadgeModelControllerType.Community,
) {
  return `/badgeModel/${controllerType}/${badgeModelId}/explorer`
}

export function generateBadgeModelCreate(
  controllerType: string = BadgeModelControllerType.Community,
) {
  return `/badgeModel/create/${controllerType}`
}

export function generateExplorer() {
  return `/explorer`
}

export function generateBadgeCurate() {
  return `/curate`
}

type ChainAgnosticParams = {
  theBadgeContractAddress: string
  connectedChainId: ChainsValues
}

/**
 *
 * @param badgeId
 * @param extraParams - Use contractValue if you already have the queryParam
 * value, if not you can provided chain and contract address individually
 */
export function generateBadgePreviewUrl(
  badgeId: string,
  extraParams: ChainAgnosticParams | { contractValue: string },
) {
  if ('contractValue' in extraParams) {
    return `/badge/${badgeId}?contract=${extraParams.contractValue}`
  } else {
    const { connectedChainId, theBadgeContractAddress } = extraParams
    return `/badge/${badgeId}?contract=${connectedChainId}:${theBadgeContractAddress}`
  }
}

export function generateProfileUrl(args?: {
  address?: string
  filter?: string
  profileType?: ProfileType
  connectedChainId?: ChainsValues
}) {
  const { address, connectedChainId, filter, profileType } = args || {}
  let url = `/user/profile`

  const queryParameters = []

  if (address) {
    url += `/${address}`
  }

  if (filter) {
    queryParameters.push(`filter=${encodeURIComponent(filter)}`)
  }

  if (profileType) {
    queryParameters.push(`profileType=${encodeURIComponent(profileType)}`)
  }

  if (connectedChainId) {
    queryParameters.push(`networkId=${encodeURIComponent(connectedChainId)}`)
  }

  if (queryParameters.length > 0) {
    url += `?${queryParameters.join('&')}`
  }

  return url
}

export function generateCreatorRegisterUrl() {
  return '/user/register'
}

export function generateBaseUrl() {
  return '/'
}

export function generateEvidenceUrl() {
  return '/evidence'
}

export function generateLegalTermsUrl() {
  return '/legal/terms'
}

export function generateLegalPrivacyPolicyUrl() {
  return '/legal/privacy-policy'
}

export function generateLinkedinUrl(certData: {
  name: string
  organizationName?: string
  organizationId?: string
  issueYear: string
  issueMonth: string
  expirationYear?: string
  expirationMonth?: string
  certUrl: string
  certId: string
}) {
  let certDataCleaned = _.pickBy(certData, _.negate(_.isUndefined))
  certDataCleaned = _.pickBy(certDataCleaned, _.negate(_.isEmpty))

  if (!certDataCleaned.organizationId && !certDataCleaned.organizationName) {
    throw new Error('OrganizationId or organizationName should be defined!')
  }

  const queryParams = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    ...certDataCleaned,
  })

  return `${LINKEDIN_URL}/profile/add?${queryParams.toString()}`
}

export function generateLinkedinOrganization(linkedinUrl: string): string {
  const regex = /\/(\d+)\/?$/
  const match = linkedinUrl.match(regex)
  return match ? match[1] : linkedinUrl
}

export function generateTwitterText(badgeModelName: string, badgePreviewUrl: string): string {
  return `Hey World!

I just got my #Web3 Certificate: ${badgeModelName} from @TheBadgexyz 🤩 

👉 You can check my badge here: ${badgePreviewUrl}`
}

type OpenseaParams = {
  badgeId: string
  contractAddress: string
  networkId: ChainsValues
}

export function generateOpenseaUrl({
  badgeId,
  contractAddress,
  networkId,
}: OpenseaParams): string | null {
  switch (networkId) {
    case Chains.goerli:
    case Chains.sepolia:
    case Chains.mumbai: {
      const chainName = getChainName(networkId)
      return `https://testnets.opensea.io/assets/${chainName}/${contractAddress}/${badgeId}`
    }
    case Chains.polygon: {
      const chainName = getChainName(networkId)
      return `https://opensea.io/assets/${chainName}/${contractAddress}/${badgeId}`
    }
    default: {
      console.warn(`Unsupported network: ${networkId}`)
      return null
    }
  }
}
