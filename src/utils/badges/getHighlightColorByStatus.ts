import { colors } from 'thebadge-ui-library'

import { BadgeStatus } from '@/types/generated/subgraph'

export default function getHighlightColorByStatus(badgeStatus?: BadgeStatus) {
  switch (badgeStatus) {
    case BadgeStatus.Approved:
      return colors.blue
    case BadgeStatus.InReview:
      return colors.green
    case BadgeStatus.Rejected:
      return colors.pink
    case BadgeStatus.Revoked:
      return colors.black
    default:
      return colors.white
  }
}
