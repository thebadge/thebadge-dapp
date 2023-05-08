import React from 'react'

import { EmptyBadgePreview } from 'thebadge-ui-library'

export default function emptyBadges(amount: number) {
  return Array.from({ length: amount }).map((v, i) => <EmptyBadgePreview key={i} size="small" />)
}

export function fillListWithPlaceholders(
  list: JSX.Element[] | undefined,
  placeholder: JSX.Element,
  minAmount: number,
) {
  if (!list) {
    return Array.from({ length: minAmount }).map((v, i) => (
      <React.Fragment key={i}>{placeholder}</React.Fragment>
    ))
  }
  if (list.length >= minAmount) {
    return list
  }
  const placeholdersList = Array.from({ length: minAmount - list.length }).map((v, i) => (
    <React.Fragment key={i}>{placeholder}</React.Fragment>
  ))
  return [...list, ...placeholdersList]
}
