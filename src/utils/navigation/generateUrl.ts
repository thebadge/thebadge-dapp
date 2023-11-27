import _ from 'lodash'

import { APP_URL, LINKEDIN_URL } from '@/src/constants/common'
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

export function generateBadgeExplorer() {
  return `/badgeModel/explorer`
}

export function generateBadgeCurate() {
  return `/curate`
}

export function generateBadgePreviewUrl(
  badgeId: string,
  extraParams: {
    theBadgeContractAddress: string
    connectedChainId: ChainsValues
  },
) {
  const { connectedChainId, theBadgeContractAddress } = extraParams
  return `/badge/${badgeId}?contract=${connectedChainId}:${theBadgeContractAddress}`
}

// TODO revisit this, does not make much sense
export function generateModelPreviewUrl(badgeModelId: string, userAddress: string) {
  return `${APP_URL}/${badgeModelId}/${userAddress}`
}

export function generateProfileUrl(args?: {
  address?: string
  filter?: string
  profileType?: ProfileType
}) {
  const { address, filter, profileType } = args || {}
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
  const certDataCleaned = _.pickBy(certData, _.negate(_.isUndefined))
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
