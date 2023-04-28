import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

import useBadgeType from '@/src/hooks/subgraph/useBadgeType'

const PDFViewer = dynamic(() => import('@/src/components/common/PDFViewer'), {
  ssr: false,
})
export function ListingCriteriaPreview({ badgeTypeId }: { badgeTypeId: string }) {
  const [badgeCriteriaUrl, setBadgeCriteriaUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    setBadgeCriteriaUrl(undefined)
  }, [badgeTypeId])

  const badgeTypeData = useBadgeType(badgeTypeId)
  const badgeTypeMetadata = badgeTypeData.data?.badgeTypeMetadata

  if (!badgeTypeMetadata) {
    throw 'There was not possible to get the needed metadata. Try again in some minutes.'
  }

  useEffect(() => {
    const badgeCriteriaUrl =
      's3Url' in badgeTypeMetadata.fileURI ? badgeTypeMetadata?.fileURI.s3Url : ''
    if (badgeCriteriaUrl) setBadgeCriteriaUrl(badgeCriteriaUrl)
  }, [badgeTypeMetadata])

  return <PDFViewer url={badgeCriteriaUrl} />
}
