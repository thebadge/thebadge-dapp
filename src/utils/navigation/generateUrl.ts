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

export function generateBadgeModelCreate() {
  return `/badgeModel/create`
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

export function generateProfileUrl(args?: { address?: string; filter?: string }) {
  const { address, filter } = args || {}
  return `/user/profile${address ? '/' + address : ''}${filter ? '?filter=' + filter : ''}`
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
