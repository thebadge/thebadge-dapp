import { EmptyBadgePreview } from 'thebadge-ui-library'

export default function emptyBadges(amount: number) {
  return Array.from({ length: amount }).map((v, i) => <EmptyBadgePreview key={i} size="small" />)
}
