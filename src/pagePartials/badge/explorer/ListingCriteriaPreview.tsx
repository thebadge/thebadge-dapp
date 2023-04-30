import React, { useEffect, useState } from 'react'

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, IconButton } from '@mui/material'

import PDFViewer from '@/src/components/common/PDFViewer'
import useBadgeType from '@/src/hooks/subgraph/useBadgeType'

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

  return (
    <>
      <Box sx={{ position: 'absolute', right: 0, top: -8 }}>
        <IconButton onClick={() => window.open(`${badgeCriteriaUrl}`, '_ blank')}>
          <OpenInNewOutlinedIcon />
        </IconButton>
      </Box>
      <PDFViewer url={badgeCriteriaUrl} />
    </>
  )
}
