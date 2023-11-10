import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

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

export function generateBadgePreviewUrl(badgeId: string) {
  return `/badge/${badgeId}`
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
