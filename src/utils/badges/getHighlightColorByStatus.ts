import { colors } from 'thebadge-ui-library'

import { BadgeStatus } from '@/types/generated/subgraph'

export default function getHighlightColorByStatus(badgeStatus?: BadgeStatus) {
  switch (badgeStatus) {
    case BadgeStatus.Approved:
      return colors.blue
    case BadgeStatus.Requested:
      return colors.green
    case BadgeStatus.RequestRemoval:
      return colors.pink
    case BadgeStatus.Challenged:
      return colors.reredError
    default:
      return colors.white
  }
}
