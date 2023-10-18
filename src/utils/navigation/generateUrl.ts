import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

export function generateMintUrl(controllerType: string, badgeModelId: string) {
  return `/badge/mint/${controllerType || BadgeModelControllerType.Community}/${badgeModelId}`
}

export function generateModelExplorerUrl(badgeModelId: string) {
  return `/badge/model/${badgeModelId}/explorer`
}

export function generateBadgeModelCreate() {
  return `/badge/model/create`
}

export function generateBadgeExplorer() {
  return `/badge/explorer`
}

export function generateBadgeCurate() {
  return `/badge/curate`
}

export function generateBadgePreviewUrl(badgeId: string) {
  return `/badge/preview/${badgeId}`
}

export function generateProfileUrl(args?: { address?: string; filter?: string }) {
  const { address, filter } = args || {}
  return `/profile${address ? '/' + address : ''}${filter ? '?filter=' + filter : ''}`
}

export function generateCreatorRegisterUrl() {
  return '/creator/register'
}

export function generateBaseUrl() {
  return '/'
}
